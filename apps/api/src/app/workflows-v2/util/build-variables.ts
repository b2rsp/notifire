import _ from 'lodash';
import { AdditionalOperation, RulesLogic } from 'json-logic-js';
import { PinoLogger } from '@novu/application-generic';

import { Variable, extractLiquidTemplateVariables, TemplateVariables } from './template-parser/liquid-parser';
import { WrapMailyInLiquidUseCase } from '../../environments-v1/usecases/output-renderers/maily-to-liquid/wrap-maily-in-liquid.usecase';
import { isStringifiedMailyJSONContent } from '../../environments-v1/usecases/output-renderers/maily-to-liquid/wrap-maily-in-liquid.command';
import { extractFieldsFromRules, isValidRule } from '../../shared/services/query-parser/query-parser.service';

export function buildVariables(
  variableSchema: Record<string, unknown> | undefined,
  controlValue: unknown | Record<string, unknown>,
  logger?: PinoLogger
): TemplateVariables {
  let variableControlValue = controlValue;

  if (isStringifiedMailyJSONContent(variableControlValue)) {
    try {
      variableControlValue = new WrapMailyInLiquidUseCase().execute({
        emailEditor: variableControlValue,
      });
    } catch (error) {
      logger?.error(
        {
          err: error as Error,
          controlKey: 'unknown',
          message: 'Failed to transform maily content to liquid syntax',
        },
        'BuildVariables'
      );
    }
  } else if (isValidRule(variableControlValue as RulesLogic<AdditionalOperation>)) {
    const fields = extractFieldsFromRules(variableControlValue as RulesLogic<AdditionalOperation>)
      .filter((field) => field.startsWith('payload.') || field.startsWith('subscriber.data.'))
      .map((field) => `{{${field}}}`);

    variableControlValue = {
      rules: variableControlValue,
      fields,
    };
  }

  const { validVariables, invalidVariables } = extractLiquidTemplateVariables(JSON.stringify(variableControlValue));

  // don't compare against schema if it's not provided
  if (!variableSchema) {
    return { validVariables, invalidVariables };
  }

  const { validVariables: validSchemaVariables, invalidVariables: invalidSchemaVariables } = identifyUnknownVariables(
    variableSchema || {},
    validVariables
  );

  return {
    validVariables: validSchemaVariables,
    invalidVariables: [...invalidVariables, ...invalidSchemaVariables],
  };
}

function isPropertyAllowed(schema: Record<string, unknown>, propertyPath: string) {
  let currentSchema = { ...schema };
  if (!currentSchema || typeof currentSchema !== 'object') {
    return false;
  }

  const pathParts = propertyPath
    .split('.')
    .map((part) => {
      // Split array notation into [propName, index]
      const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);

      return arrayMatch ? [arrayMatch[1], arrayMatch[2]] : [part];
    })
    .flat();

  for (const part of pathParts) {
    const { properties, additionalProperties, type } = currentSchema;

    // Handle direct property access
    if (properties?.[part]) {
      currentSchema = properties[part];
      continue;
    }

    // Handle array paths - valid if schema is array type
    if (type === 'array') {
      // Valid array index or property access
      const isArrayIndex = !Number.isNaN(Number(part)) && Number(part) >= 0;
      const arrayItemSchema = currentSchema.items as Record<string, unknown>;

      if (isArrayIndex) {
        currentSchema = arrayItemSchema;
        continue;
      }

      if (arrayItemSchema?.properties?.[part]) {
        currentSchema = arrayItemSchema.properties[part];
        continue;
      }
    }

    if (additionalProperties === true) {
      return true;
    }

    return false;
  }

  return true;
}

function createInvalidVariable(variable: Variable): Variable {
  return {
    name: variable.output,
    context: variable.context,
    message: 'Variable is not supported',
    output: variable.output,
  };
}

function identifyUnknownVariables(
  variableSchema: Record<string, unknown>,
  validVariables: Variable[]
): TemplateVariables {
  const variables = _.cloneDeep(validVariables);

  return variables.reduce<TemplateVariables>(
    (acc, variable) => {
      const isValid = isPropertyAllowed(variableSchema, variable.name);

      if (isValid) {
        acc.validVariables.push(variable);
      } else {
        acc.invalidVariables.push(createInvalidVariable(variable));
      }

      return acc;
    },
    { validVariables: [], invalidVariables: [] }
  );
}
