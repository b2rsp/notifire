/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type ActivityStatsResponseDto = {
  weeklySent: number;
  monthlySent: number;
};

/** @internal */
export const ActivityStatsResponseDto$inboundSchema: z.ZodType<
  ActivityStatsResponseDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  weeklySent: z.number(),
  monthlySent: z.number(),
});

/** @internal */
export type ActivityStatsResponseDto$Outbound = {
  weeklySent: number;
  monthlySent: number;
};

/** @internal */
export const ActivityStatsResponseDto$outboundSchema: z.ZodType<
  ActivityStatsResponseDto$Outbound,
  z.ZodTypeDef,
  ActivityStatsResponseDto
> = z.object({
  weeklySent: z.number(),
  monthlySent: z.number(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ActivityStatsResponseDto$ {
  /** @deprecated use `ActivityStatsResponseDto$inboundSchema` instead. */
  export const inboundSchema = ActivityStatsResponseDto$inboundSchema;
  /** @deprecated use `ActivityStatsResponseDto$outboundSchema` instead. */
  export const outboundSchema = ActivityStatsResponseDto$outboundSchema;
  /** @deprecated use `ActivityStatsResponseDto$Outbound` instead. */
  export type Outbound = ActivityStatsResponseDto$Outbound;
}

export function activityStatsResponseDtoToJSON(
  activityStatsResponseDto: ActivityStatsResponseDto,
): string {
  return JSON.stringify(
    ActivityStatsResponseDto$outboundSchema.parse(activityStatsResponseDto),
  );
}

export function activityStatsResponseDtoFromJSON(
  jsonString: string,
): SafeParseResult<ActivityStatsResponseDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => ActivityStatsResponseDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'ActivityStatsResponseDto' from JSON`,
  );
}
