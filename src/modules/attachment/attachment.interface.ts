export interface ICreateAttachmentPayload {
  taskId: string;
  fileUrl: string;
  fileName: string;
  fileType?: string;
}