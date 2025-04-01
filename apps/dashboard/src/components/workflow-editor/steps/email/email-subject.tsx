import { ControlInput } from '@/components/primitives/control-input';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/primitives/form/form';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { useParseVariables } from '@/hooks/use-parse-variables';
import { capitalize, containsHTMLEntities } from '@/utils/string';
import { cn } from '@/utils/ui';
import { useFormContext } from 'react-hook-form';

const subjectKey = 'subject';

export const EmailSubject = () => {
  const { control, getValues } = useFormContext();
  const { step } = useWorkflow();
  const { variables, isAllowedVariable } = useParseVariables(step?.variables);

  return (
    <FormField
      control={control}
      name={subjectKey}
      render={({ field }) => (
        <>
          <FormItem className="w-full">
            <FormControl>
              <ControlInput
                className={cn('px-0')}
                size="md"
                indentWithTab={false}
                autoFocus={!field.value}
                placeholder={capitalize(field.name)}
                id={field.name}
                variables={variables}
                isAllowedVariable={isAllowedVariable}
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            </FormControl>
            <FormMessage>
              {containsHTMLEntities(field.value) &&
                !getValues('disableOutputSanitization') &&
                'HTML entities detected. Consider disabling content sanitization for proper rendering'}
            </FormMessage>
          </FormItem>
        </>
      )}
    />
  );
};
