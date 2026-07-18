export type EntitlementFeature =
  | "agents"
  | "quizzes"
  | "norm_annotations"
  | "portal_tickets";

export type PlanSlug = "student" | "professional" | "client";

/** Default feature map when DB plans.features is unavailable */
export const PLAN_FEATURES: Record<PlanSlug, EntitlementFeature[]> = {
  student: ["quizzes", "norm_annotations", "agents"],
  professional: ["agents", "norm_annotations"],
  client: ["portal_tickets"],
};

export const ACTIVE_SUB_STATUSES = new Set(["active", "trialing"]);
