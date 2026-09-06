export interface ICreatePaymentPayload {
  organizationId: string;
  subscriptionId: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  amount: number;
  currency: string;
}