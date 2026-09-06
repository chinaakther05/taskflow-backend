import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { ActivityService } from "./activity.service";

const createActivity = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await ActivityService.createActivity(
      userId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Activity created successfully",
      data: result,
    });
  },
);

const getActivitiesByOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const organizationId =
      req.params.organizationId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const result =
      await ActivityService.getActivitiesByOrganization(
        userId,
        organizationId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activities retrieved successfully",
      data: result,
    });
  },
);

const getActivitiesByTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await ActivityService.getActivitiesByTask(
      userId,
      taskId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task activities retrieved successfully",
      data: result,
    });
  },
);

const getActivityById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const activityId = req.params.activityId?.toString();

    if (!activityId) {
      throw new Error("Activity ID is required");
    }

    const result = await ActivityService.getActivityById(
      userId,
      activityId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Activity retrieved successfully",
      data: result,
    });
  },
);

export const ActivityController = {
  createActivity,
  getActivitiesByOrganization,
  getActivitiesByTask,
  getActivityById,
};