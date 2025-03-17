import type { InboxProps } from '../components/Inbox';
import type {
  UseNotificationsProps,
  UseNotificationsResult,
  UsePreferencesProps,
  UsePreferencesResult,
} from '../hooks';
import type { NovuProviderProps } from '../hooks/NovuProvider';
import type { UseCountsProps, UseCountsResult } from '../hooks/useCounts';

export * from '../utils/types';

/**
 * Exporting all components from the components folder
 * as empty functions to fix build errors in SSR
 * This will be replaced with actual components
 * when we implement the SSR components in @novu/js/ui
 */
export function Inbox(props: InboxProps) {
  return <>{props.children}</>;
}

export function InboxContent() {}

export function Notifications() {}

export function Preferences() {}

export function Bell() {}

export function NovuProvider(props: NovuProviderProps) {
  return <>{props.children}</>;
}

export function useNovu() {
  return null;
}

export function useCounts(_: UseCountsProps): UseCountsResult {
  return {
    isLoading: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
}

export function useNotifications(_: UseNotificationsProps): UseNotificationsResult {
  return {
    isLoading: false,
    isFetching: false,
    hasMore: false,
    readAll: () => Promise.resolve({ data: undefined, error: undefined }),
    archiveAll: () => Promise.resolve({ data: undefined, error: undefined }),
    archiveAllRead: () => Promise.resolve({ data: undefined, error: undefined }),
    refetch: () => Promise.resolve(),
    fetchMore: () => Promise.resolve(),
  };
}

export function usePreferences(_: UsePreferencesProps): UsePreferencesResult {
  return {
    isLoading: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
}
