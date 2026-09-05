export interface ICreateProjectPayload {
  name: string;
  description?: string;
  organizationId: string;
  deadline?: Date;
}

export interface IUpdateProjectPayload {
  name?: string;
  description?: string;
  status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
  deadline?: Date;
}