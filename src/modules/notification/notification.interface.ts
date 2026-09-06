export interface ICreateNotificationPayload {
  type:
    | "TASK_ASSIGNED"
    | "TASK_STATUS_CHANGED"
    | "TASK_DEADLINE_NEAR"
    | "COMMENT_ADDED"
    | "MEMBER_ADDED"
    | "PROJECT_CREATED"
    | "PAYMENT_SUCCESS";

  title: string;
  message: string;
  organizationId: string;
  userId: string;
}