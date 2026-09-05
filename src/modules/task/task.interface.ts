export interface ICreateTaskPayload {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  deadline?: Date;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  status?:
    | "PENDING_ACCEPTANCE"
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string | null;
  deadline?: Date | null;
}