export interface ICreateActivityPayload {
  action: string;
  details?: string;
  organizationId: string;
  projectId: string;
  taskId: string;
}