import React, { HTMLAttributes, useMemo, useRef, useState } from 'react';

import { InputPure, InputRoot, InputWrapper } from '@/components/primitives/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/primitives/popover';
import { VariableList, VariableListRef } from '@/components/variable/variable-list';
import { AUTOCOMPLETE_PASSWORD_MANAGERS_OFF } from '@/utils/constants';
import { cn } from '@/utils/ui';

type VariableSelectProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  value?: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  title?: string;
  placeholder?: string;
  error?: string;
  emptyStateMessage?: {
    primary: string;
    secondary: string;
  };
};

/**
 * A searchable dropdown component for selecting variables with keyboard navigation support.
 *
 * Features:
 * - Filterable options list
 * - Keyboard navigation (↑/↓ arrows)
 * - Auto-creation of new options when typing custom values
 * - Visual feedback for selected items
 * - Support for custom left icon
 * - Empty state when no variables are available
 */
export const VariableSelect = (props: VariableSelectProps) => {
  const {
    className,
    disabled,
    value,
    options,
    onChange,
    leftIcon,
    title = 'Variables',
    error,
    placeholder,
    emptyStateMessage,
    ...rest
  } = props;
  const [inputValue, setInputValue] = useState(value ?? '');
  const [filterValue, setFilterValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const variablesListRef = useRef<VariableListRef>(null);

  const filteredOptions = useMemo(() => {
    if (!filterValue) {
      return options;
    }

    return options.filter((option) => option.value?.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()));
  }, [options, filterValue]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();

    if (newValue !== inputValue) {
      setInputValue(newValue);
      setFilterValue(newValue);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsOpen(true);

    if (e.key === 'ArrowDown') {
      variablesListRef.current?.next();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      variablesListRef.current?.prev();
      e.preventDefault();
    } else if (e.key === 'Enter') {
      variablesListRef.current?.select();
    }
  };

  const onSelect = (newValue: string) => {
    setIsOpen(false);
    setFilterValue('');
    setInputValue(newValue);
    onChange(newValue);
  };

  const onOpen = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const onClose = () => {
    setIsOpen(false);
    setFilterValue('');
    const newInputValue = inputValue !== '' ? inputValue : (value ?? '');
    setInputValue(newInputValue);
    onChange(newInputValue);
  };

  const onFocusCapture = () => {
    variablesListRef.current?.focusFirst();
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <PopoverAnchor asChild>
        <div className={cn('flex w-40 flex-col gap-1', className)} {...rest}>
          <InputRoot size="2xs" hasError={!!error}>
            <InputWrapper>
              {leftIcon}
              <InputPure
                ref={inputRef}
                value={inputValue}
                onClick={onOpen}
                onChange={onInputChange}
                onFocusCapture={onFocusCapture}
                // use blur only when there are no filtered options, otherwise it closes the popover on keyboard navigation
                onBlurCapture={filteredOptions.length === 0 ? onClose : undefined}
                placeholder={placeholder ?? 'Field'}
                disabled={disabled}
                onKeyDown={onInputKeyDown}
                {...AUTOCOMPLETE_PASSWORD_MANAGERS_OFF}
              />
            </InputWrapper>
          </InputRoot>
          {error && <span className="text-destructive text-xs">{error}</span>}
        </div>
      </PopoverAnchor>
      {filteredOptions.length > 0 && (
        <PopoverContent
          className="min-w-[250px] max-w-[250px] p-0"
          side="bottom"
          align="start"
          onOpenAutoFocus={(e) => {
            // prevent the input from being blurred when the popover opens
            e.preventDefault();
          }}
          onFocusOutside={onClose}
        >
          <VariableList
            ref={variablesListRef}
            options={filteredOptions}
            onSelect={onSelect}
            selectedValue={value}
            title={title}
          />
        </PopoverContent>
      )}

      {filteredOptions.length === 0 && !inputValue && (
        <PopoverContent
          className="min-w-[250px] max-w-[250px] p-0"
          side="bottom"
          align="start"
          onOpenAutoFocus={(e) => {
            // prevent the input from being blurred when the popover opens
            e.preventDefault();
          }}
          onFocusOutside={onClose}
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-foreground-600 text-sm">{emptyStateMessage?.primary ?? 'Refine the key'}</p>
            <p className="text-foreground-400 mt-1 text-xs">
              {emptyStateMessage?.secondary ??
                'Type "payload." to specify a payload variable to refine the key further'}
            </p>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
