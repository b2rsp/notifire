/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { ClosedEnum } from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  ActivityNotificationExecutionDetailResponseDto,
  ActivityNotificationExecutionDetailResponseDto$inboundSchema,
  ActivityNotificationExecutionDetailResponseDto$Outbound,
  ActivityNotificationExecutionDetailResponseDto$outboundSchema,
} from "./activitynotificationexecutiondetailresponsedto.js";
import {
  ActivityNotificationStepResponseDto,
  ActivityNotificationStepResponseDto$inboundSchema,
  ActivityNotificationStepResponseDto$Outbound,
  ActivityNotificationStepResponseDto$outboundSchema,
} from "./activitynotificationstepresponsedto.js";
import {
  DigestMetadataDto,
  DigestMetadataDto$inboundSchema,
  DigestMetadataDto$Outbound,
  DigestMetadataDto$outboundSchema,
} from "./digestmetadatadto.js";
import {
  ProvidersIdEnum,
  ProvidersIdEnum$inboundSchema,
  ProvidersIdEnum$outboundSchema,
} from "./providersidenum.js";

/**
 * Type of the job
 */
export const ActivityNotificationJobResponseDtoType = {
  InApp: "in_app",
  Email: "email",
  Sms: "sms",
  Chat: "chat",
  Push: "push",
  Digest: "digest",
  Trigger: "trigger",
  Delay: "delay",
  Custom: "custom",
} as const;
/**
 * Type of the job
 */
export type ActivityNotificationJobResponseDtoType = ClosedEnum<
  typeof ActivityNotificationJobResponseDtoType
>;

/**
 * Optional payload for the job
 */
export type Payload = {};

export type ActivityNotificationJobResponseDto = {
  /**
   * Unique identifier of the job
   */
  id: string;
  /**
   * Type of the job
   */
  type: ActivityNotificationJobResponseDtoType;
  /**
   * Optional digest for the job, including metadata and events
   */
  digest?: DigestMetadataDto | undefined;
  /**
   * Execution details of the job
   */
  executionDetails: Array<ActivityNotificationExecutionDetailResponseDto>;
  /**
   * Step details of the job
   */
  step: ActivityNotificationStepResponseDto;
  /**
   * Optional context object for additional error details.
   */
  overrides?: { [k: string]: any } | undefined;
  /**
   * Optional payload for the job
   */
  payload?: Payload | undefined;
  /**
   * Provider ID of the job
   */
  providerId: ProvidersIdEnum;
  /**
   * Status of the job
   */
  status: string;
  /**
   * Updated time of the notification
   */
  updatedAt?: string | undefined;
};

/** @internal */
export const ActivityNotificationJobResponseDtoType$inboundSchema:
  z.ZodNativeEnum<typeof ActivityNotificationJobResponseDtoType> = z.nativeEnum(
    ActivityNotificationJobResponseDtoType,
  );

/** @internal */
export const ActivityNotificationJobResponseDtoType$outboundSchema:
  z.ZodNativeEnum<typeof ActivityNotificationJobResponseDtoType> =
    ActivityNotificationJobResponseDtoType$inboundSchema;

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ActivityNotificationJobResponseDtoType$ {
  /** @deprecated use `ActivityNotificationJobResponseDtoType$inboundSchema` instead. */
  export const inboundSchema =
    ActivityNotificationJobResponseDtoType$inboundSchema;
  /** @deprecated use `ActivityNotificationJobResponseDtoType$outboundSchema` instead. */
  export const outboundSchema =
    ActivityNotificationJobResponseDtoType$outboundSchema;
}

/** @internal */
export const Payload$inboundSchema: z.ZodType<Payload, z.ZodTypeDef, unknown> =
  z.object({});

/** @internal */
export type Payload$Outbound = {};

/** @internal */
export const Payload$outboundSchema: z.ZodType<
  Payload$Outbound,
  z.ZodTypeDef,
  Payload
> = z.object({});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Payload$ {
  /** @deprecated use `Payload$inboundSchema` instead. */
  export const inboundSchema = Payload$inboundSchema;
  /** @deprecated use `Payload$outboundSchema` instead. */
  export const outboundSchema = Payload$outboundSchema;
  /** @deprecated use `Payload$Outbound` instead. */
  export type Outbound = Payload$Outbound;
}

export function payloadToJSON(payload: Payload): string {
  return JSON.stringify(Payload$outboundSchema.parse(payload));
}

export function payloadFromJSON(
  jsonString: string,
): SafeParseResult<Payload, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Payload$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Payload' from JSON`,
  );
}

/** @internal */
export const ActivityNotificationJobResponseDto$inboundSchema: z.ZodType<
  ActivityNotificationJobResponseDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  _id: z.string(),
  type: ActivityNotificationJobResponseDtoType$inboundSchema,
  digest: DigestMetadataDto$inboundSchema.optional(),
  executionDetails: z.array(
    ActivityNotificationExecutionDetailResponseDto$inboundSchema,
  ),
  step: ActivityNotificationStepResponseDto$inboundSchema,
  overrides: z.record(z.any()).optional(),
  payload: z.lazy(() => Payload$inboundSchema).optional(),
  providerId: ProvidersIdEnum$inboundSchema,
  status: z.string(),
  updatedAt: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    "_id": "id",
  });
});

/** @internal */
export type ActivityNotificationJobResponseDto$Outbound = {
  _id: string;
  type: string;
  digest?: DigestMetadataDto$Outbound | undefined;
  executionDetails: Array<
    ActivityNotificationExecutionDetailResponseDto$Outbound
  >;
  step: ActivityNotificationStepResponseDto$Outbound;
  overrides?: { [k: string]: any } | undefined;
  payload?: Payload$Outbound | undefined;
  providerId: string;
  status: string;
  updatedAt?: string | undefined;
};

/** @internal */
export const ActivityNotificationJobResponseDto$outboundSchema: z.ZodType<
  ActivityNotificationJobResponseDto$Outbound,
  z.ZodTypeDef,
  ActivityNotificationJobResponseDto
> = z.object({
  id: z.string(),
  type: ActivityNotificationJobResponseDtoType$outboundSchema,
  digest: DigestMetadataDto$outboundSchema.optional(),
  executionDetails: z.array(
    ActivityNotificationExecutionDetailResponseDto$outboundSchema,
  ),
  step: ActivityNotificationStepResponseDto$outboundSchema,
  overrides: z.record(z.any()).optional(),
  payload: z.lazy(() => Payload$outboundSchema).optional(),
  providerId: ProvidersIdEnum$outboundSchema,
  status: z.string(),
  updatedAt: z.string().optional(),
}).transform((v) => {
  return remap$(v, {
    id: "_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace ActivityNotificationJobResponseDto$ {
  /** @deprecated use `ActivityNotificationJobResponseDto$inboundSchema` instead. */
  export const inboundSchema = ActivityNotificationJobResponseDto$inboundSchema;
  /** @deprecated use `ActivityNotificationJobResponseDto$outboundSchema` instead. */
  export const outboundSchema =
    ActivityNotificationJobResponseDto$outboundSchema;
  /** @deprecated use `ActivityNotificationJobResponseDto$Outbound` instead. */
  export type Outbound = ActivityNotificationJobResponseDto$Outbound;
}

export function activityNotificationJobResponseDtoToJSON(
  activityNotificationJobResponseDto: ActivityNotificationJobResponseDto,
): string {
  return JSON.stringify(
    ActivityNotificationJobResponseDto$outboundSchema.parse(
      activityNotificationJobResponseDto,
    ),
  );
}

export function activityNotificationJobResponseDtoFromJSON(
  jsonString: string,
): SafeParseResult<ActivityNotificationJobResponseDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) =>
      ActivityNotificationJobResponseDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'ActivityNotificationJobResponseDto' from JSON`,
  );
}
