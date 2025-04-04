import { Injectable, InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';
import get from 'lodash/get';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { captureException } from '@sentry/node';
import { NotificationTemplateEntity } from '@novu/dal';

import {
  ChannelTypeEnum,
  createMockObjectFromSchema,
  GeneratePreviewResponseDto,
  JobStatusEnum,
  PreviewPayload,
  StepResponseDto,
  WorkflowOriginEnum,
  StepTypeEnum,
} from '@novu/shared';
import {
  GetWorkflowByIdsCommand,
  GetWorkflowByIdsUseCase,
  Instrument,
  InstrumentUsecase,
  PinoLogger,
  dashboardSanitizeControlValues,
} from '@novu/application-generic';
import { channelStepSchemas, actionStepSchemas } from '@novu/framework/internal';
import { JSONContent as MailyJSONContent } from '@maily-to/render';
import { PreviewStep, PreviewStepCommand } from '../../../bridge/usecases/preview-step';
import { FrameworkPreviousStepsOutputState } from '../../../bridge/usecases/preview-step/preview-step.command';
import { BuildStepDataUsecase } from '../build-step-data';
import { PreviewCommand } from './preview.command';
import { CreateVariablesObjectCommand } from '../create-variables-object/create-variables-object.command';
import { CreateVariablesObject } from '../create-variables-object/create-variables-object.usecase';
import { buildLiquidParser, Variable } from '../../util/template-parser/liquid-parser';
import { buildVariables } from '../../util/build-variables';
import { mergeCommonObjectKeys, multiplyArrayItems } from '../../util/utils';
import { buildVariablesSchema } from '../../util/create-schema';
import { isObjectMailyJSONContent } from '../../../environments-v1/usecases/output-renderers/maily-to-liquid/wrap-maily-in-liquid.command';

const LOG_CONTEXT = 'GeneratePreviewUsecase';

@Injectable()
export class PreviewUsecase {
  constructor(
    private previewStepUsecase: PreviewStep,
    private buildStepDataUsecase: BuildStepDataUsecase,
    private getWorkflowByIdsUseCase: GetWorkflowByIdsUseCase,
    private createVariablesObject: CreateVariablesObject,
    private readonly logger: PinoLogger
  ) {}

  @InstrumentUsecase()
  async execute(command: PreviewCommand): Promise<GeneratePreviewResponseDto> {
    try {
      const {
        stepData,
        controlValues: initialControlValues,
        variableSchema,
        variablesObject,
        workflow,
      } = await this.initializePreviewContext(command);
      const commandVariablesExample = command.generatePreviewRequestDto.previewPayload;

      /**
       * We don't want to sanitize control values for code workflows,
       * as it's the responsibility of the custom code workflow creator
       */
      const sanitizedValidatedControls =
        workflow.origin === WorkflowOriginEnum.NOVU_CLOUD
          ? this.sanitizeControlsForPreview(initialControlValues, stepData)
          : initialControlValues;

      if (!sanitizedValidatedControls && workflow.origin === WorkflowOriginEnum.NOVU_CLOUD) {
        throw new Error(
          // eslint-disable-next-line max-len
          'Control values normalization failed, normalizeControlValues function requires maintenance to sanitize the provided type or data structure correctly'
        );
      }

      let previewTemplateData = {
        variablesExample: {},
        controlValues: {},
      };

      for (const [controlKey, controlValue] of Object.entries(sanitizedValidatedControls || {})) {
        const variables = buildVariables(variableSchema, controlValue, this.logger);

        const controlValueWithFixedVariables = this.fixControlValueInvalidVariables(
          controlValue,
          variables.invalidVariables
        );

        /*
         * Sanitize control values after fixing (by fixControlValueInvalidVariables) invalid variables,
         * to avoid defaulting (by previewControlValueDefault) all values
         */
        const processedControlValues = this.sanitizeControlValuesByLiquidCompilationFailure(
          controlKey,
          controlValueWithFixedVariables
        );

        // multiply array items by 3 for preview example purposes
        const multipliedVariablesExampleResult = multiplyArrayItems(variablesObject, 3);

        previewTemplateData = {
          variablesExample: _.merge(previewTemplateData.variablesExample, multipliedVariablesExampleResult),
          controlValues: {
            ...previewTemplateData.controlValues,
            [controlKey]: isObjectMailyJSONContent(processedControlValues)
              ? JSON.stringify(processedControlValues)
              : processedControlValues,
          },
        };
      }

      const mergedVariablesExample = this.mergeVariablesExample(workflow, previewTemplateData, commandVariablesExample);
      const executeOutput = await this.executePreviewUsecase(
        command,
        stepData,
        mergedVariablesExample,
        previewTemplateData.controlValues
      );

      return {
        result: {
          preview: executeOutput.outputs as any,
          type: stepData.type as unknown as ChannelTypeEnum,
        },
        previewPayloadExample: mergedVariablesExample,
      };
    } catch (error) {
      this.logger.error(
        {
          err: error,
          workflowIdOrInternalId: command.workflowIdOrInternalId,
          stepIdOrInternalId: command.stepIdOrInternalId,
        },
        `Unexpected error while generating preview`,
        LOG_CONTEXT
      );
      if (process.env.SENTRY_DSN) {
        captureException(error);
      }

      return {
        result: {
          preview: {},
          type: undefined,
        },
        previewPayloadExample: {},
      } as any;
    }
  }

  private sanitizeControlsForPreview(initialControlValues: Record<string, unknown>, stepData: StepResponseDto) {
    const sanitizedValues = dashboardSanitizeControlValues(this.logger, initialControlValues, stepData.type);
    const sanitizedByOutputSchema = sanitizeControlValuesByOutputSchema(sanitizedValues || {}, stepData.type);

    return sanitizedByOutputSchema;
  }

  private mergeVariablesExample(
    workflow: NotificationTemplateEntity,
    previewTemplateData: { variablesExample: {}; controlValues: {} },
    commandVariablesExample: PreviewPayload | undefined
  ) {
    let { variablesExample } = previewTemplateData;

    if (workflow.origin === WorkflowOriginEnum.EXTERNAL) {
      // if external workflow, we need to override with stored payload schema
      const schemaBasedVariables = createMockObjectFromSchema({
        type: 'object',
        properties: { payload: workflow.payloadSchema },
      });
      variablesExample = _.merge(variablesExample, schemaBasedVariables);
    }

    if (commandVariablesExample && Object.keys(commandVariablesExample).length > 0) {
      // merge only values of common keys between variablesExample and commandVariablesExample
      variablesExample = mergeCommonObjectKeys(
        variablesExample as Record<string, unknown>,
        commandVariablesExample as Record<string, unknown>
      );
    }

    return variablesExample;
  }

  private async initializePreviewContext(command: PreviewCommand) {
    const stepData = await this.getStepData(command);
    const controlValues = command.generatePreviewRequestDto.controlValues || stepData.controls.values || {};
    const workflow = await this.findWorkflow(command);

    const variablesObject = await this.createVariablesObject.execute(
      CreateVariablesObjectCommand.create({
        environmentId: command.user.environmentId,
        organizationId: command.user.organizationId,
        userId: command.user._id,
        workflowId: command.workflowIdOrInternalId,
        controlValues,
      })
    );

    const variableSchema = await this.buildVariablesSchema(variablesObject, stepData.variables);

    return { stepData, controlValues, variableSchema, variablesObject, workflow };
  }

  @Instrument()
  private async buildVariablesSchema(variablesObject: Record<string, unknown>, variables: Record<string, unknown>) {
    const { payload } = variablesObject;
    const payloadSchema = buildVariablesSchema(payload);

    if (Object.keys(payloadSchema).length === 0) {
      return variables;
    }

    return _.merge(variables, { properties: { payload: payloadSchema } });
  }

  @Instrument()
  private async findWorkflow(command: PreviewCommand) {
    return await this.getWorkflowByIdsUseCase.execute(
      GetWorkflowByIdsCommand.create({
        workflowIdOrInternalId: command.workflowIdOrInternalId,
        environmentId: command.user.environmentId,
        organizationId: command.user.organizationId,
      })
    );
  }

  @Instrument()
  private async getStepData(command: PreviewCommand) {
    return await this.buildStepDataUsecase.execute({
      workflowIdOrInternalId: command.workflowIdOrInternalId,
      stepIdOrInternalId: command.stepIdOrInternalId,
      user: command.user,
    });
  }

  private isFrameworkError(obj: any): obj is FrameworkError {
    return typeof obj === 'object' && obj.status === '400' && obj.name === 'BridgeRequestError';
  }

  @Instrument()
  private async executePreviewUsecase(
    command: PreviewCommand,
    stepData: StepResponseDto,
    hydratedPayload: PreviewPayload,
    controlValues: Record<string, unknown>
  ) {
    const state = buildState(hydratedPayload.steps);
    try {
      return await this.previewStepUsecase.execute(
        PreviewStepCommand.create({
          payload: hydratedPayload.payload || {},
          subscriber: hydratedPayload.subscriber,
          controls: controlValues || {},
          environmentId: command.user.environmentId,
          organizationId: command.user.organizationId,
          stepId: stepData.stepId,
          userId: command.user._id,
          workflowId: stepData.workflowId,
          workflowOrigin: stepData.origin,
          state,
        })
      );
    } catch (error) {
      if (this.isFrameworkError(error)) {
        throw new GeneratePreviewError(error);
      } else {
        throw error;
      }
    }
  }

  private fixControlValueInvalidVariables(controlValues: unknown, invalidVariables: Variable[]): unknown {
    try {
      let controlValuesString = JSON.stringify(controlValues);

      for (const invalidVariable of invalidVariables) {
        if (!controlValuesString.includes(invalidVariable.output)) {
          continue;
        }

        const EMPTY_STRING = '';
        controlValuesString = replaceAll(controlValuesString, invalidVariable.output, EMPTY_STRING);
      }

      return JSON.parse(controlValuesString);
    } catch (error) {
      return controlValues;
    }
  }

  private sanitizeControlValuesByLiquidCompilationFailure(key: string, value: unknown): unknown {
    const parserEngine = buildLiquidParser();

    try {
      parserEngine.parse(JSON.stringify(value));

      return value;
    } catch (error) {
      return get(previewControlValueDefault, key);
    }
  }
}
function buildState(steps: Record<string, unknown> | undefined): FrameworkPreviousStepsOutputState[] {
  const outputArray: FrameworkPreviousStepsOutputState[] = [];
  for (const [stepId, value] of Object.entries(steps || {})) {
    outputArray.push({
      stepId,
      outputs: value as Record<string, unknown>,
      state: {
        status: JobStatusEnum.COMPLETED,
      },
    });
  }

  return outputArray;
}

/**
 * Replaces all occurrences of a search string with a replacement string.
 */
export function replaceAll(text: string, searchValue: string, replaceValue: string): string {
  return _.replace(text, new RegExp(_.escapeRegExp(searchValue), 'g'), replaceValue);
}

export class GeneratePreviewError extends InternalServerErrorException {
  constructor(error: FrameworkError) {
    super({
      message: `GeneratePreviewError: Original Message:`,
      frameworkMessage: error.response.message,
      code: error.response.code,
      data: error.response.data,
    });
  }
}

class FrameworkError {
  response: {
    message: string;
    code: string;
    data: unknown;
  };
  status: number;
  options: Record<string, unknown>;
  message: string;
  name: string;
}

function sanitizeControlValuesByOutputSchema(
  controlValues: Record<string, unknown>,
  type: StepTypeEnum
): Record<string, unknown> {
  const outputSchema = channelStepSchemas[type].output || actionStepSchemas[type].output;

  if (!outputSchema || !controlValues) {
    return controlValues;
  }

  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(outputSchema);
  const isValid = validate(controlValues);
  const errors = validate.errors as null | ErrorObject[];

  if (isValid || !errors || errors?.length === 0) {
    return controlValues;
  }

  return replaceInvalidControlValues(controlValues, errors);
}

/**
 * Fixes invalid control values by applying default values from the schema
 *
 * @example
 * // Input:
 * const values = { foo: 'invalid' };
 * const errors = [{ instancePath: '/foo' }];
 * const defaults = { foo: 'default' };
 *
 * // Output:
 * const fixed = { foo: 'default' };
 */
function replaceInvalidControlValues(
  normalizedControlValues: Record<string, unknown>,
  errors: ErrorObject[]
): Record<string, unknown> {
  const fixedValues = _.cloneDeep(normalizedControlValues);

  for (const error of errors) {
    /*
     *  we allow additional properties in control values compare to output
     *  such as skip and disableOutputSanitization
     */
    if (error.keyword === 'additionalProperties') {
      continue;
    }

    const path = getErrorPath(error);
    const defaultValue = _.get(previewControlValueDefault, path);
    _.set(fixedValues, path, defaultValue);
  }

  return fixedValues;
}

/*
 * Extracts the path from the error object:
 * 1. If instancePath exists, removes leading slash and converts remaining slashes to dots
 * 2. If no instancePath, uses missingProperty from error params
 * Example: "/foo/bar" becomes "foo.bar"
 */
function getErrorPath(error: ErrorObject): string {
  return (error.instancePath.substring(1) || error.params.missingProperty).replace(/\//g, '.');
}

const EMPTY_STRING = '';
const WHITESPACE = ' ';
const DEFAULT_URL_TARGET = '_blank';
const DEFAULT_URL_PATH = 'https://www.redirect-example.com';
const DEFAULT_TIP_TAP_EMPTY_PREVIEW: MailyJSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: EMPTY_STRING,
        },
      ],
    },
  ],
};

/**
 * Default control values used specifically for preview purposes.
 * These values are designed to be parsable by Liquid.js and provide
 * safe fallback values when generating preview.
 */
export const previewControlValueDefault = {
  subject: EMPTY_STRING,
  body: WHITESPACE,
  avatar: DEFAULT_URL_PATH,
  emailEditor: DEFAULT_TIP_TAP_EMPTY_PREVIEW,
  data: {},
  'primaryAction.label': EMPTY_STRING,
  'primaryAction.redirect.url': DEFAULT_URL_PATH,
  'primaryAction.redirect.target': DEFAULT_URL_TARGET,
  'secondaryAction.label': EMPTY_STRING,
  'secondaryAction.redirect.url': DEFAULT_URL_PATH,
  'secondaryAction.redirect.target': DEFAULT_URL_TARGET,
  'redirect.url': DEFAULT_URL_PATH,
  'redirect.target': DEFAULT_URL_TARGET,
} as const;
