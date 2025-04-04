import { ChannelPreference, PreferenceLevel, Workflow } from '../types';

export type FetchPreferencesArgs = {
  level?: PreferenceLevel;
  tags?: string[];
};

export type ListPreferencesArgs = {
  tags?: string[];
};

export type UpdatePreferencesArgs = {
  workflowId?: string;
  channels: ChannelPreference;
  /** @deprecated Use channels instead */
  channelPreferences?: ChannelPreference;
  preference?: {
    level: PreferenceLevel;
    enabled: boolean;
    channels: ChannelPreference;
    workflow?: Workflow;
  };
};
