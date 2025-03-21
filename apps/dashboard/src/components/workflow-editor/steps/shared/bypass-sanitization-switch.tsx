import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/primitives/form/form';
import { HelpTooltipIndicator } from '@/components/primitives/help-tooltip-indicator';
import { Switch } from '@/components/primitives/switch';
import { useSaveForm } from '@/components/workflow-editor/steps/save-form-context';
import { useFormContext } from 'react-hook-form';

const fieldKey = 'disableOutputSanitization';

export const BypassSanitizationSwitch = () => {
  const { control } = useFormContext();
  const { saveForm } = useSaveForm();

  return (
    <div className="flex items-center gap-1">
      <FormField
        control={control}
        name={fieldKey}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between gap-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(e) => {
                  field.onChange(e);
                  saveForm();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormLabel className="text-foreground-600 text-xs">Bypass sanitization</FormLabel>
      <HelpTooltipIndicator
        size="4"
        text="Disabling content sanitization may expose your app to security risks such as XSS attacks. Only use with trusted input."
      />
    </div>
  );
};
