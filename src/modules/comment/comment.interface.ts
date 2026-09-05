export interface ICreateCommentPayload {
  content: string;
  taskId: string;
}

export interface IUpdateCommentPayload {
  content: string;
}