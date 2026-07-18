export type EntitlementFeature =
  | "agents"
  | "norm_annotations"
  | "portal_tickets";

export type PlanSlug = "professional" | "client";

/** Default feature map when DB plans.features is unavailable */
export const PLAN_FEATURES: Record<PlanSlug, EntitlementFeature[]> = {
  professional: ["agents", "norm_annotations"],
  client: ["portal_tickets"],
};

export const ACTIVE_SUB_STATUSES = new Set(["active", "trialing"]);
