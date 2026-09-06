import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { TimeLogService } from "./timeLog.service";

const createTimeLog = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await TimeLogService.createTimeLog(
      userId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Time log created successfully",
      data: result,
    });
  },
);

const getTimeLogsByTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await TimeLogService.getTimeLogsByTask(
      userId,
      taskId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Time logs retrieved successfully",
      data: result,
    });
  },
);

const getTimeLogById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const timeLogId = req.params.timeLogId?.toString();

    if (!timeLogId) {
      throw new Error("Time log ID is required");
    }

    const result = await TimeLogService.getTimeLogById(
      userId,
      timeLogId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Time log retrieved successfully",
      data: result,
    });
  },
);

const updateTimeLog = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const timeLogId = req.params.timeLogId?.toString();

    if (!timeLogId) {
      throw new Error("Time log ID is required");
    }

    const result = await TimeLogService.updateTimeLog(
      userId,
      timeLogId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Time log updated successfully",
      data: result,
    });
  },
);

const deleteTimeLog = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const timeLogId = req.params.timeLogId?.toString();

    if (!timeLogId) {
      throw new Error("Time log ID is required");
    }

    const result = await TimeLogService.deleteTimeLog(
      userId,
      timeLogId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Time log deleted successfully",
      data: result,
    });
  },
);

export const TimeLogController = {
  createTimeLog,
  getTimeLogsByTask,
  getTimeLogById,
  updateTimeLog,
  deleteTimeLog,
};