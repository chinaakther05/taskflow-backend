import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";

import { TaskService } from "./task.service";

// Create Task
const createTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await TaskService.createTask(
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Task created successfully",
      data: result,
    });
  },
);

// Get Tasks By Project
const getTasksByProject = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const projectId = req.params.projectId?.toString();

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const result = await TaskService.getTasksByProject(
      projectId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tasks retrieved successfully",
      data: result,
    });
  },
);

// Get Task By ID
const getTaskById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await TaskService.getTaskById(
      taskId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task retrieved successfully",
      data: result,
    });
  },
);

// Update Task
const updateTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await TaskService.updateTask(
      taskId,
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task updated successfully",
      data: result,
    });
  },
);

// Delete Task
const deleteTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await TaskService.deleteTask(
      taskId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task deleted successfully",
      data: result,
    });
  },
);

export const TaskController = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};