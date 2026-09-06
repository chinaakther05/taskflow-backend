export interface ICreateSubscriptionPayload {
  organizationId: string;
  plan: "FREE" | "PRO" | "BUSINESS";
}

export interface IUpdateSubscriptionPayload {
  plan?: "FREE" | "PRO" | "BUSINESS";
  maxProjects?: number;
  maxMembers?: number;
}