/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { ClosedEnum } from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export const Channels = {
  InApp: "in_app",
  Email: "email",
  Sms: "sms",
  Chat: "chat",
  Push: "push",
} as const;
export type Channels = ClosedEnum<typeof Channels>;

export type ActivityGraphStatesResponse = {
  id: string;
  count: number;
  templates: Array<string>;
  channels: Array<Channels>;
};

/** @internal */
export const Channels$inboundSchema: z.ZodNativeEnum<typeof Channels> = z
  .nativeEnum(Channels);

/** @internal */
export const Channels$outboundSchema: z.ZodNativeEnum<typeof Channels> =
  Channels$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Channels$ {
  /** @deprecated use `Channels$inboundSchema` instead. */
  export const inboundSchema = Channels$inboundSchema;
  /** @deprecated use `Channels$outboundSchema` instead. */
  export const outboundSchema = Channels$outboundSchema;
}

/** @internal */
export const ActivityGraphStatesResponse$inboundSchema: z.ZodType<
  ActivityGraphStatesResponse,
  z.ZodTypeDef,
  unknown
> = z.object({
  _id: z.string(),
  count: z.number(),
  templates: z.array(z.string()),
  channels: z.array(Channels$inboundSchema),
}).transform((v) => {
  return remap$(v, {
    "_id": "id",
  });
});

/** @internal */
export type ActivityGraphStatesResponse$Outbound = {
  _id: string;
  count: number;
  templates: Array<string>;
  channels: Array<string>;
};

/** @internal */
export const ActivityGraphStatesResponse$outboundSchema: z.ZodType<
  ActivityGraphStatesResponse$Outbound,
  z.ZodTypeDef,
  ActivityGraphStatesResponse
> = z.object({
  id: z.string(),
  count: z.number(),
  templates: z.array(z.string()),
  channels: z.array(Channels$outboundSchema),
}).transform((v) => {
  return remap$(v, {
    id: "_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ActivityGraphStatesResponse$ {
  /** @deprecated use `ActivityGraphStatesResponse$inboundSchema` instead. */
  export const inboundSchema = ActivityGraphStatesResponse$inboundSchema;
  /** @deprecated use `ActivityGraphStatesResponse$outboundSchema` instead. */
  export const outboundSchema = ActivityGraphStatesResponse$outboundSchema;
  /** @deprecated use `ActivityGraphStatesResponse$Outbound` instead. */
  export type Outbound = ActivityGraphStatesResponse$Outbound;
}

export function activityGraphStatesResponseToJSON(
  activityGraphStatesResponse: ActivityGraphStatesResponse,
): string {
  return JSON.stringify(
    ActivityGraphStatesResponse$outboundSchema.parse(
      activityGraphStatesResponse,
    ),
  );
}

export function activityGraphStatesResponseFromJSON(
  jsonString: string,
): SafeParseResult<ActivityGraphStatesResponse, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => ActivityGraphStatesResponse$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'ActivityGraphStatesResponse' from JSON`,
  );
}
