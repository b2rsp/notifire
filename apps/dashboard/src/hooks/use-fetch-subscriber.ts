import { getSubscriber } from '@/api/subscribers';
import { useEnvironment } from '@/context/environment/hooks';
import { QueryKeys } from '@/utils/query-keys';
import { SubscriberResponseDto } from '@novu/api/models/components';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type SubscriberResponse = Awaited<ReturnType<typeof getSubscriber>>;

type Props = {
  subscriberId: string;
  options?: Omit<UseQueryOptions<SubscriberResponse, Error>, 'queryKey' | 'queryFn'>;
};

export function useFetchSubscriber({ subscriberId, options = {} }: Props) {
  const { currentEnvironment } = useEnvironment();

  const subscriberQuery = useQuery<SubscriberResponseDto>({
    queryKey: [QueryKeys.fetchSubscriber, currentEnvironment?._id, subscriberId],
    queryFn: () => getSubscriber({ environment: currentEnvironment!, subscriberId }),
    enabled: !!currentEnvironment,
    ...options,
  });

  return subscriberQuery;
}
