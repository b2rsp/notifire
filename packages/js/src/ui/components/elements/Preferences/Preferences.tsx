import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { Preference } from '../../../../preferences/preference';
import { ChannelPreference, ChannelType, PreferenceLevel } from '../../../../types';
import { usePreferences } from '../../../api';
import { setDynamicLocalization } from '../../../config';
import { StringLocalizationKey, useInboxContext, useLocalization } from '../../../context';
import { cn, useStyle } from '../../../helpers';
import { ArrowDropDown } from '../../../icons';
import { AppearanceKey } from '../../../types';
import { Collapsible } from '../../primitives/Collapsible';
import { ChannelRow, getLabel } from './ChannelRow';
import { PreferencesListSkeleton } from './PreferencesListSkeleton';

/* This is also going to be exported as a separate component. Keep it pure. */
export const Preferences = () => {
  const style = useStyle();
  const { preferencesFilter } = useInboxContext();

  const { preferences, loading } = usePreferences({ tags: preferencesFilter()?.tags });

  const allPreferences = createMemo(() => {
    const globalPreference = preferences()?.find((preference) => preference.level === PreferenceLevel.GLOBAL);
    const workflowPreferences = preferences()?.filter((preference) => preference.level === PreferenceLevel.TEMPLATE);
    const workflowPreferencesIds = workflowPreferences?.map((preference) => preference.workflow?.id);

    return { globalPreference, workflowPreferences, workflowPreferencesIds };
  });

  createEffect(() => {
    // Register the names as localizable
    setDynamicLocalization((prev) => ({
      ...prev,
      ...allPreferences().workflowPreferences?.reduce<Record<string, string>>((acc, preference) => {
        acc[preference.workflow!.identifier] = preference.workflow!.name;

        return acc;
      }, {}),
    }));
  });

  const optimisticUpdate =
    (preference?: Preference) =>
    async ({ channel, enabled }: { channel: ChannelType; enabled: boolean }) => {
      await preference?.update({
        channels: {
          [channel]: enabled,
        },
      });
    };

  return (
    <div
      class={style('preferencesContainer', 'nt-px-3 nt-py-4 nt-flex nt-flex-col nt-gap-1 nt-overflow-y-auto nt-h-full')}
    >
      <PreferencesRow
        localizationKey="preferences.global"
        channels={allPreferences().globalPreference?.channels || {}}
        onChange={optimisticUpdate(allPreferences().globalPreference)}
      />
      <Show
        when={allPreferences().workflowPreferences?.length}
        fallback={<PreferencesListSkeleton loading={loading()} />}
      >
        {/* We iterate over the workflow preferences ids to avoid losing the preferences row state, otherwise the row will be mounted */}
        <For each={allPreferences().workflowPreferencesIds}>
          {(_, index) => {
            const preference = () => allPreferences().workflowPreferences?.[index()] as Preference;

            if (!preference()) {
              return null;
            }

            return (
              <PreferencesRow
                localizationKey={preference().workflow!.identifier as StringLocalizationKey}
                channels={preference().channels}
                workflowId={preference().workflow?.id}
                onChange={optimisticUpdate(preference())}
              />
            );
          }}
        </For>
      </Show>
    </div>
  );
};

type WorkflowDescriptionProps = JSX.IntrinsicElements['div'] & {
  channels: ChannelPreference;
  appearanceKey: AppearanceKey;
};

const WorkflowDescription = (props: WorkflowDescriptionProps) => {
  const style = useStyle();

  const channelNames = () => {
    const channels = [];

    for (const key in props.channels) {
      if (props.channels[key as keyof ChannelPreference] !== undefined) {
        const isDisabled = !props.channels[key as keyof ChannelPreference];

        const element = (
          <span
            class={style('channelName', 'data-[disabled=true]:nt-text-foreground-alpha-400')}
            data-disabled={isDisabled}
          >
            {getLabel(key as ChannelType)}
          </span>
        );
        channels.push(element);
      }
    }

    return channels.map((c, index) => (
      <>
        {c}
        {index < channels.length - 1 && ', '}
      </>
    ));
  };

  return (
    <div class={style(props.appearanceKey, cn('nt-text-sm nt-text-foreground-alpha-600 nt-text-start', props.class))}>
      {channelNames()}
    </div>
  );
};

const PreferencesRow = (props: {
  localizationKey: StringLocalizationKey;
  channels: ChannelPreference;
  workflowId?: string;
  onChange: ({ channel, enabled, workflowId }: { workflowId?: string; channel: ChannelType; enabled: boolean }) => void;
}) => {
  const style = useStyle();
  const [isOpenDescription, setIsOpenDescription] = createSignal(true);
  const [isOpenChannels, setIsOpenChannels] = createSignal(false);
  const { t } = useLocalization();

  const channels = createMemo(() => Object.keys(props.channels));

  return (
    <Show when={channels().length > 0}>
      <div
        class={style('workflowContainer', `nt-p-1 nt-bg-neutral-alpha-25 nt-rounded-lg`)}
        data-open={isOpenChannels()}
      >
        <div
          class={style(
            'workflowLabelContainer',
            'nt-flex nt-justify-between nt-p-1 nt-flex-nowrap nt-self-stretch nt-cursor-pointer nt-items-center nt-overflow-hidden'
          )}
          onClick={() => {
            setIsOpenChannels((prev) => !prev);
            setIsOpenDescription((prev) => !prev);
          }}
        >
          <div class={style('workflowLabelHeader', 'nt-overflow-hidden')}>
            <div
              class={style('workflowLabel', 'nt-text-sm nt-font-semibold nt-truncate')}
              data-localization={props.localizationKey}
              data-open={isOpenChannels()}
            >
              {t(props.localizationKey)}
            </div>
            <Collapsible open={isOpenDescription()}>
              <WorkflowDescription
                channels={props.channels}
                appearanceKey="workflowDescription"
                class="nt-overflow-hidden"
              />
            </Collapsible>
          </div>
          <span
            class={style(
              'workflowContainerRight__icon',
              `nt-text-foreground-alpha-600 nt-transition-all nt-duration-200 data-[open=true]:nt-transform data-[open=true]:nt-rotate-180`
            )}
            data-open={isOpenChannels()}
          >
            <ArrowDropDown class={style('workflowArrow__icon', 'nt-text-foreground-alpha-600 nt-size-4')} />
          </span>
        </div>
        <Collapsible open={isOpenChannels()}>
          <div
            class={style(
              'channelsContainer',
              'nt-flex nt-bg-background nt-border nt-border-neutral-alpha-50 nt-rounded-lg nt-p-2 nt-flex-col nt-gap-1 nt-overflow-hidden'
            )}
          >
            <For each={channels()}>
              {(channel) => (
                <ChannelRow
                  channel={channel as ChannelType}
                  enabled={!!props.channels[channel as keyof ChannelPreference]}
                  workflowId={props.workflowId}
                  onChange={props.onChange}
                />
              )}
            </For>
          </div>
        </Collapsible>
      </div>
    </Show>
  );
};
