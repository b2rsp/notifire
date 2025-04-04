/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import {
  MutationKey,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { NovuCore } from "../core.js";
import { topicsRename } from "../funcs/topicsRename.js";
import { combineSignals } from "../lib/primitives.js";
import { RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";
import { useNovuContext } from "./_context.js";
import { MutationHookOptions } from "./_types.js";

export type TopicsRenameMutationVariables = {
  renameTopicRequestDto: components.RenameTopicRequestDto;
  topicKey: string;
  idempotencyKey?: string | undefined;
  options?: RequestOptions;
};

export type TopicsRenameMutationData =
  operations.TopicsControllerRenameTopicResponse;

/**
 * Rename a topic
 *
 * @remarks
 * Rename a topic by providing a new name
 */
export function useTopicsRenameMutation(
  options?: MutationHookOptions<
    TopicsRenameMutationData,
    Error,
    TopicsRenameMutationVariables
  >,
): UseMutationResult<
  TopicsRenameMutationData,
  Error,
  TopicsRenameMutationVariables
> {
  const client = useNovuContext();
  return useMutation({
    ...buildTopicsRenameMutation(client, options),
    ...options,
  });
}

export function mutationKeyTopicsRename(): MutationKey {
  return ["@novu/api", "Topics", "rename"];
}

export function buildTopicsRenameMutation(
  client$: NovuCore,
  hookOptions?: RequestOptions,
): {
  mutationKey: MutationKey;
  mutationFn: (
    variables: TopicsRenameMutationVariables,
  ) => Promise<TopicsRenameMutationData>;
} {
  return {
    mutationKey: mutationKeyTopicsRename(),
    mutationFn: function topicsRenameMutationFn({
      renameTopicRequestDto,
      topicKey,
      idempotencyKey,
      options,
    }): Promise<TopicsRenameMutationData> {
      const mergedOptions = {
        ...hookOptions,
        ...options,
        fetchOptions: {
          ...hookOptions?.fetchOptions,
          ...options?.fetchOptions,
          signal: combineSignals(
            hookOptions?.fetchOptions?.signal,
            options?.fetchOptions?.signal,
          ),
        },
      };
      return unwrapAsync(topicsRename(
        client$,
        renameTopicRequestDto,
        topicKey,
        idempotencyKey,
        mergedOptions,
      ));
    },
  };
}
