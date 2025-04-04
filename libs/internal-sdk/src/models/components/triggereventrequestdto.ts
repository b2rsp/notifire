/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  SubscriberPayloadDto,
  SubscriberPayloadDto$inboundSchema,
  SubscriberPayloadDto$Outbound,
  SubscriberPayloadDto$outboundSchema,
} from "./subscriberpayloaddto.js";
import {
  TenantPayloadDto,
  TenantPayloadDto$inboundSchema,
  TenantPayloadDto$Outbound,
  TenantPayloadDto$outboundSchema,
} from "./tenantpayloaddto.js";
import {
  TopicPayloadDto,
  TopicPayloadDto$inboundSchema,
  TopicPayloadDto$Outbound,
  TopicPayloadDto$outboundSchema,
} from "./topicpayloaddto.js";

export type One = TopicPayloadDto | SubscriberPayloadDto | string;

/**
 * The recipients list of people who will receive the notification.
 */
export type To =
  | TopicPayloadDto
  | SubscriberPayloadDto
  | Array<TopicPayloadDto | SubscriberPayloadDto | string>
  | string;

/**
 * It is used to display the Avatar of the provided actor's subscriber id or actor object.
 *
 * @remarks
 *     If a new actor object is provided, we will create a new subscriber in our system
 */
export type Actor = SubscriberPayloadDto | string;

/**
 * It is used to specify a tenant context during trigger event.
 *
 * @remarks
 *     Existing tenants will be updated with the provided details.
 */
export type Tenant = TenantPayloadDto | string;

export type TriggerEventRequestDto = {
  /**
   * The trigger identifier of the workflow you wish to send. This identifier can be found on the workflow page.
   */
  workflowId: string;
  /**
   * The payload object is used to pass additional custom information that could be
   *
   * @remarks
   *     used to render the workflow, or perform routing rules based on it.
   *       This data will also be available when fetching the notifications feed from the API to display certain parts of the UI.
   */
  payload?: { [k: string]: any } | undefined;
  /**
   * This could be used to override provider specific configurations
   */
  overrides?: { [k: string]: { [k: string]: any } } | undefined;
  /**
   * The recipients list of people who will receive the notification.
   */
  to:
    | TopicPayloadDto
    | SubscriberPayloadDto
    | Array<TopicPayloadDto | SubscriberPayloadDto | string>
    | string;
  /**
   * A unique identifier for this transaction, we will generate a UUID if not provided.
   */
  transactionId?: string | undefined;
  /**
   * It is used to display the Avatar of the provided actor's subscriber id or actor object.
   *
   * @remarks
   *     If a new actor object is provided, we will create a new subscriber in our system
   */
  actor?: SubscriberPayloadDto | string | undefined;
  /**
   * It is used to specify a tenant context during trigger event.
   *
   * @remarks
   *     Existing tenants will be updated with the provided details.
   */
  tenant?: TenantPayloadDto | string | undefined;
};

/** @internal */
export const One$inboundSchema: z.ZodType<One, z.ZodTypeDef, unknown> = z.union(
  [
    TopicPayloadDto$inboundSchema,
    SubscriberPayloadDto$inboundSchema,
    z.string(),
  ],
);

/** @internal */
export type One$Outbound =
  | TopicPayloadDto$Outbound
  | SubscriberPayloadDto$Outbound
  | string;

/** @internal */
export const One$outboundSchema: z.ZodType<One$Outbound, z.ZodTypeDef, One> = z
  .union([
    TopicPayloadDto$outboundSchema,
    SubscriberPayloadDto$outboundSchema,
    z.string(),
  ]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace One$ {
  /** @deprecated use `One$inboundSchema` instead. */
  export const inboundSchema = One$inboundSchema;
  /** @deprecated use `One$outboundSchema` instead. */
  export const outboundSchema = One$outboundSchema;
  /** @deprecated use `One$Outbound` instead. */
  export type Outbound = One$Outbound;
}

export function oneToJSON(one: One): string {
  return JSON.stringify(One$outboundSchema.parse(one));
}

export function oneFromJSON(
  jsonString: string,
): SafeParseResult<One, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => One$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'One' from JSON`,
  );
}

/** @internal */
export const To$inboundSchema: z.ZodType<To, z.ZodTypeDef, unknown> = z.union([
  TopicPayloadDto$inboundSchema,
  SubscriberPayloadDto$inboundSchema,
  z.array(
    z.union([
      TopicPayloadDto$inboundSchema,
      SubscriberPayloadDto$inboundSchema,
      z.string(),
    ]),
  ),
  z.string(),
]);

/** @internal */
export type To$Outbound =
  | TopicPayloadDto$Outbound
  | SubscriberPayloadDto$Outbound
  | Array<TopicPayloadDto$Outbound | SubscriberPayloadDto$Outbound | string>
  | string;

/** @internal */
export const To$outboundSchema: z.ZodType<To$Outbound, z.ZodTypeDef, To> = z
  .union([
    TopicPayloadDto$outboundSchema,
    SubscriberPayloadDto$outboundSchema,
    z.array(
      z.union([
        TopicPayloadDto$outboundSchema,
        SubscriberPayloadDto$outboundSchema,
        z.string(),
      ]),
    ),
    z.string(),
  ]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace To$ {
  /** @deprecated use `To$inboundSchema` instead. */
  export const inboundSchema = To$inboundSchema;
  /** @deprecated use `To$outboundSchema` instead. */
  export const outboundSchema = To$outboundSchema;
  /** @deprecated use `To$Outbound` instead. */
  export type Outbound = To$Outbound;
}

export function toToJSON(to: To): string {
  return JSON.stringify(To$outboundSchema.parse(to));
}

export function toFromJSON(
  jsonString: string,
): SafeParseResult<To, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => To$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'To' from JSON`,
  );
}

/** @internal */
export const Actor$inboundSchema: z.ZodType<Actor, z.ZodTypeDef, unknown> = z
  .union([SubscriberPayloadDto$inboundSchema, z.string()]);

/** @internal */
export type Actor$Outbound = SubscriberPayloadDto$Outbound | string;

/** @internal */
export const Actor$outboundSchema: z.ZodType<
  Actor$Outbound,
  z.ZodTypeDef,
  Actor
> = z.union([SubscriberPayloadDto$outboundSchema, z.string()]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Actor$ {
  /** @deprecated use `Actor$inboundSchema` instead. */
  export const inboundSchema = Actor$inboundSchema;
  /** @deprecated use `Actor$outboundSchema` instead. */
  export const outboundSchema = Actor$outboundSchema;
  /** @deprecated use `Actor$Outbound` instead. */
  export type Outbound = Actor$Outbound;
}

export function actorToJSON(actor: Actor): string {
  return JSON.stringify(Actor$outboundSchema.parse(actor));
}

export function actorFromJSON(
  jsonString: string,
): SafeParseResult<Actor, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Actor$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Actor' from JSON`,
  );
}

/** @internal */
export const Tenant$inboundSchema: z.ZodType<Tenant, z.ZodTypeDef, unknown> = z
  .union([TenantPayloadDto$inboundSchema, z.string()]);

/** @internal */
export type Tenant$Outbound = TenantPayloadDto$Outbound | string;

/** @internal */
export const Tenant$outboundSchema: z.ZodType<
  Tenant$Outbound,
  z.ZodTypeDef,
  Tenant
> = z.union([TenantPayloadDto$outboundSchema, z.string()]);

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace Tenant$ {
  /** @deprecated use `Tenant$inboundSchema` instead. */
  export const inboundSchema = Tenant$inboundSchema;
  /** @deprecated use `Tenant$outboundSchema` instead. */
  export const outboundSchema = Tenant$outboundSchema;
  /** @deprecated use `Tenant$Outbound` instead. */
  export type Outbound = Tenant$Outbound;
}

export function tenantToJSON(tenant: Tenant): string {
  return JSON.stringify(Tenant$outboundSchema.parse(tenant));
}

export function tenantFromJSON(
  jsonString: string,
): SafeParseResult<Tenant, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => Tenant$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'Tenant' from JSON`,
  );
}

/** @internal */
export const TriggerEventRequestDto$inboundSchema: z.ZodType<
  TriggerEventRequestDto,
  z.ZodTypeDef,
  unknown
> = z.object({
  name: z.string(),
  payload: z.record(z.any()).optional(),
  overrides: z.record(z.record(z.any())).optional(),
  to: z.union([
    TopicPayloadDto$inboundSchema,
    SubscriberPayloadDto$inboundSchema,
    z.array(
      z.union([
        TopicPayloadDto$inboundSchema,
        SubscriberPayloadDto$inboundSchema,
        z.string(),
      ]),
    ),
    z.string(),
  ]),
  transactionId: z.string().optional(),
  actor: z.union([SubscriberPayloadDto$inboundSchema, z.string()]).optional(),
  tenant: z.union([TenantPayloadDto$inboundSchema, z.string()]).optional(),
}).transform((v) => {
  return remap$(v, {
    "name": "workflowId",
  });
});

/** @internal */
export type TriggerEventRequestDto$Outbound = {
  name: string;
  payload?: { [k: string]: any } | undefined;
  overrides?: { [k: string]: { [k: string]: any } } | undefined;
  to:
    | TopicPayloadDto$Outbound
    | SubscriberPayloadDto$Outbound
    | Array<TopicPayloadDto$Outbound | SubscriberPayloadDto$Outbound | string>
    | string;
  transactionId?: string | undefined;
  actor?: SubscriberPayloadDto$Outbound | string | undefined;
  tenant?: TenantPayloadDto$Outbound | string | undefined;
};

/** @internal */
export const TriggerEventRequestDto$outboundSchema: z.ZodType<
  TriggerEventRequestDto$Outbound,
  z.ZodTypeDef,
  TriggerEventRequestDto
> = z.object({
  workflowId: z.string(),
  payload: z.record(z.any()).optional(),
  overrides: z.record(z.record(z.any())).optional(),
  to: z.union([
    TopicPayloadDto$outboundSchema,
    SubscriberPayloadDto$outboundSchema,
    z.array(
      z.union([
        TopicPayloadDto$outboundSchema,
        SubscriberPayloadDto$outboundSchema,
        z.string(),
      ]),
    ),
    z.string(),
  ]),
  transactionId: z.string().optional(),
  actor: z.union([SubscriberPayloadDto$outboundSchema, z.string()]).optional(),
  tenant: z.union([TenantPayloadDto$outboundSchema, z.string()]).optional(),
}).transform((v) => {
  return remap$(v, {
    workflowId: "name",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace TriggerEventRequestDto$ {
  /** @deprecated use `TriggerEventRequestDto$inboundSchema` instead. */
  export const inboundSchema = TriggerEventRequestDto$inboundSchema;
  /** @deprecated use `TriggerEventRequestDto$outboundSchema` instead. */
  export const outboundSchema = TriggerEventRequestDto$outboundSchema;
  /** @deprecated use `TriggerEventRequestDto$Outbound` instead. */
  export type Outbound = TriggerEventRequestDto$Outbound;
}

export function triggerEventRequestDtoToJSON(
  triggerEventRequestDto: TriggerEventRequestDto,
): string {
  return JSON.stringify(
    TriggerEventRequestDto$outboundSchema.parse(triggerEventRequestDto),
  );
}

export function triggerEventRequestDtoFromJSON(
  jsonString: string,
): SafeParseResult<TriggerEventRequestDto, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => TriggerEventRequestDto$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'TriggerEventRequestDto' from JSON`,
  );
}
