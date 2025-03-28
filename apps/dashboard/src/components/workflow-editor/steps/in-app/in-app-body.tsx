import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlInput } from '@/components/primitives/control-input';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/primitives/form/form';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { parseStepVariablesToLiquidVariables } from '@/utils/parseStepVariablesToLiquidVariables';
import { capitalize, containsHTMLEntities, containsVariables } from '@/utils/string';
import { InputRoot } from '../../../primitives/input';

const bodyKey = 'body';

export const InAppBody = () => {
  const { control, getValues } = useFormContext();
  const { step } = useWorkflow();
  const variables = useMemo(() => (step ? parseStepVariablesToLiquidVariables(step.variables) : []), [step]);

  return (
    <FormField
      control={control}
      name={bodyKey}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <FormControl>
            <InputRoot hasError={!!fieldState.error}>
              <ControlInput
                className="min-h-[7rem]"
                indentWithTab={false}
                placeholder={capitalize(field.name)}
                id={field.name}
                value={field.value}
                onChange={field.onChange}
                variables={variables}
                autoFocus
                multiline
              />
            </InputRoot>
          </FormControl>
          <FormMessage>
            {containsHTMLEntities(field.value) && !getValues('disableOutputSanitization')
              ? 'HTML entities detected. Consider disabling content sanitization for proper rendering'
              : field.value.length > 2 && !containsVariables(field.value)
                ? `Type {{ for variables, or wrap text in ** for bold.`
                : ''}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};
