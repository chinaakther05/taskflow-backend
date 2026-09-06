export interface ICreateTimeLogPayload {
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  note?: string;
}

export interface IUpdateTimeLogPayload {
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  note?: string;
}