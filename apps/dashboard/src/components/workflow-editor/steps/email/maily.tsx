import { Editor } from '@maily-to/core';
import { getVariableSuggestions, HTMLCodeBlockExtension, VariableExtension } from '@maily-to/core/extensions';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { HTMLAttributes, useCallback, useMemo, useState } from 'react';

import { HTMLCodeBlockView } from '@/components/workflow-editor/steps/email/extensions/html-view';
import { MailyVariablesList } from '@/components/workflow-editor/steps/email/extensions/maily-variables-list';
import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { useParseVariables } from '@/hooks/use-parse-variables';
import { useTelemetry } from '@/hooks/use-telemetry';
import { cn } from '@/utils/ui';
import { ForExtension } from './extensions/for';
import { createVariableView } from './extensions/variable-view';
import { createDefaultEditorBlocks, DEFAULT_EDITOR_CONFIG } from './maily-config';

type MailyProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

const VARIABLE_TRIGGER_CHARACTER = '{{';

/**
 * Fixed width (600px) for the email editor and rendered content.
 * This width ensures optimal compatibility across email clients
 * while maintaining good readability on all devices.
 * (Hardcoded in Maily)
 */
export const MAILY_EMAIL_WIDTH = 600;

export const Maily = ({ value, onChange, className, ...rest }: MailyProps) => {
  const { step } = useWorkflow();
  const parsedVariables = useParseVariables(step?.variables);
  const primitives = useMemo(
    () => parsedVariables.primitives.map((v) => ({ name: v.label, required: false })),
    [parsedVariables.primitives]
  );
  const arrays = useMemo(
    () => parsedVariables.arrays.map((v) => ({ name: v.label, required: false })),
    [parsedVariables.arrays]
  );
  const namespaces = useMemo(
    () => parsedVariables.namespaces.map((v) => ({ name: v.label, required: false })),
    [parsedVariables.namespaces]
  );
  const [_, setEditor] = useState<any>();
  const track = useTelemetry();

  const calculateVariables = useCallback(
    ({
      query,
      editor,
      from,
    }: {
      query: string;
      editor: TiptapEditor;
      from: 'content-variable' | 'bubble-variable' | 'repeat-variable';
    }) => {
      const queryWithoutSuffix = query.replace(/}+$/, '');
      const filteredVariables: { name: string; required: boolean }[] = [];

      function addInlineVariable() {
        if (!query.endsWith('}}')) {
          return;
        }

        if (filteredVariables.every((variable) => variable.name !== queryWithoutSuffix)) {
          return;
        }

        const from = editor?.state.selection.from - queryWithoutSuffix.length - 4; /* for prefix */
        const to = editor?.state.selection.from;

        editor?.commands.deleteRange({ from, to });
        editor?.commands.insertContent({
          type: 'variable',
          attrs: {
            id: queryWithoutSuffix,
            label: null,
            fallback: null,
            showIfKey: null,
            required: false,
          },
        });
      }

      if (from === 'repeat-variable') {
        filteredVariables.push(...arrays, ...namespaces);

        if (parsedVariables.isAllowedVariable(queryWithoutSuffix)) {
          filteredVariables.push({ name: queryWithoutSuffix, required: false });
        }

        addInlineVariable();
        return dedupAndSortVariables(filteredVariables, queryWithoutSuffix);
      }

      const iterableName = editor?.getAttributes('repeat')?.each;

      const newNamespaces = [...namespaces, ...(iterableName ? [{ name: iterableName, required: false }] : [])];

      filteredVariables.push(...primitives, ...newNamespaces);

      if (newNamespaces.some((namespace) => queryWithoutSuffix.includes(namespace.name))) {
        filteredVariables.push({ name: queryWithoutSuffix, required: false });
      }

      if (from === 'content-variable') {
        addInlineVariable();
      }

      return dedupAndSortVariables(filteredVariables, queryWithoutSuffix);
    },
    [arrays, namespaces, primitives]
  );

  const extensions = useMemo(() => {
    return [
      ForExtension,
      VariableExtension.extend({
        // @ts-expect-error - TODO: Polish Maily typing when extending Maily core and update accordingly
        addNodeView() {
          return ReactNodeViewRenderer(createVariableView(parsedVariables.isAllowedVariable), {
            className: 'relative inline-block',
            as: 'div',
          });
        },
      }).configure({
        suggestion: getVariableSuggestions(VARIABLE_TRIGGER_CHARACTER),
        // @ts-expect-error - TODO: Polish Maily typing when extending Maily core and update accordingly
        variables: calculateVariables,
        variableSuggestionsPopover: MailyVariablesList,
      }),
      HTMLCodeBlockExtension.extend({
        // @ts-expect-error - TODO: Polish Maily typing when extending Maily core and update accordingly
        addNodeView() {
          return ReactNodeViewRenderer(HTMLCodeBlockView, {
            className: 'mly-relative',
          });
        },
      }),
    ];
  }, [calculateVariables]);

  /*
   * Override Maily tippy box styles as a temporary solution.
   * Note: These styles affect both the bubble menu and block manipulation buttons (drag & drop, add).
   * TODO: Request Maily to expose these components or provide specific CSS selectors for individual targeting.
   */
  const overrideTippyBoxStyles = () => (
    <style>
      {`
          .tippy-box {
            padding-right: 20px;
            pointer-events: auto;

            .mly-cursor-grab {
              background-color: #fff;
              border-radius: 4px;
              box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
              border-radius: 4px;
              margin: 2px;
            }
          }
        `}
    </style>
  );

  return (
    <>
      {overrideTippyBoxStyles()}
      <div
        className={cn(
          `shadow-xs mx-auto flex min-h-full max-w-[${MAILY_EMAIL_WIDTH}px] flex-col items-start rounded-lg bg-white`,
          className
        )}
        {...rest}
      >
        <Editor
          key="repeat-block-enabled"
          config={DEFAULT_EDITOR_CONFIG}
          blocks={createDefaultEditorBlocks({ track })}
          // @ts-expect-error - TODO: Polish Maily typing when extending Maily core and update accordingly
          extensions={extensions}
          contentJson={value ? JSON.parse(value) : undefined}
          onCreate={setEditor}
          onUpdate={(editor) => {
            setEditor(editor);

            if (onChange) {
              onChange(JSON.stringify(editor.getJSON()));
            }
          }}
        />
      </div>
    </>
  );
};

const dedupAndSortVariables = (
  variables: { name: string; required: boolean }[],
  query: string
): { name: string; required: boolean }[] => {
  // Filter variables that match the query
  const filteredVariables = variables.filter((variable) => variable.name.toLowerCase().includes(query.toLowerCase()));

  // Deduplicate based on name property
  const uniqueVariables = Array.from(new Map(filteredVariables.map((item) => [item.name, item])).values());

  // Sort variables: exact matches first, then starts with query, then alphabetically
  return uniqueVariables.sort((a, b) => {
    const aExactMatch = a.name.toLowerCase() === query.toLowerCase();
    const bExactMatch = b.name.toLowerCase() === query.toLowerCase();
    const aStartsWithQuery = a.name.toLowerCase().startsWith(query.toLowerCase());
    const bStartsWithQuery = b.name.toLowerCase().startsWith(query.toLowerCase());

    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    if (aStartsWithQuery && !bStartsWithQuery) return -1;
    if (!aStartsWithQuery && bStartsWithQuery) return 1;

    return a.name.localeCompare(b.name);
  });
};
