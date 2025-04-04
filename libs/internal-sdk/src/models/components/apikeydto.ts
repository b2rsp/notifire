/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type ApiKeyDto = {
  /**
   * API key
   */
  key: string;
  /**
   * User ID associated with the API key
   */
  userId: string;
  /**
   * Hashed representation of the API key
   */
  hash?: string | undefined;
};

/** @internal */
export const ApiKeyDto$inboundSchema: z.ZodType<
  ApiKeyDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  key: z.string(),
  _userId: z.string(),
  hash: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    "_userId": "userId",
  });
});

/** @internal */
export type ApiKeyDto$Outbound = {
  key: string;
  _userId: string;
  hash?: string | undefined;
};

/** @internal */
export const ApiKeyDto$outboundSchema: z.ZodType<
  ApiKeyDto$Outbound,
  z.ZodTypeDef,
  ApiKeyDto
> = z.object({
  key: z.string(),
  userId: z.string(),
  hash: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    userId: "_userId",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ApiKeyDto$ {
  /** @deprecated use `ApiKeyDto$inboundSchema` instead. */
  export const inboundSchema = ApiKeyDto$inboundSchema;
  /** @deprecated use `ApiKeyDto$outboundSchema` instead. */
  export const outboundSchema = ApiKeyDto$outboundSchema;
  /** @deprecated use `ApiKeyDto$Outbound` instead. */
  export type Outbound = ApiKeyDto$Outbound;
}

export function apiKeyDtoToJSON(apiKeyDto: ApiKeyDto): string {
  return JSON.stringify(ApiKeyDto$outboundSchema.parse(apiKeyDto));
}

export function apiKeyDtoFromJSON(
  jsonString: string,
): SafeParseResult<ApiKeyDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => ApiKeyDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'ApiKeyDto' from JSON`,
  );
}
