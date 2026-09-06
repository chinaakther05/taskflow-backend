import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { NotificationService } from "./notification.service";

const createNotification = catchAsync(
  async (req: Request, res: Response) => {
    const requesterId = req.user?.userId as string;

    const result = await NotificationService.createNotification(
      requesterId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Notification created successfully",
      data: result,
    });
  },
);

const getMyNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const organizationId =
      req.params.organizationId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const result =
      await NotificationService.getMyNotifications(
        userId,
        organizationId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    });
  },
);

const getNotificationById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const notificationId =
      req.params.notificationId?.toString();

    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const result =
      await NotificationService.getNotificationById(
        userId,
        notificationId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notification retrieved successfully",
      data: result,
    });
  },
);

const markAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const notificationId =
      req.params.notificationId?.toString();

    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const result = await NotificationService.markAsRead(
      userId,
      notificationId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Notification marked as read successfully",
      data: result,
    });
  },
);

export const NotificationController = {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markAsRead,
};