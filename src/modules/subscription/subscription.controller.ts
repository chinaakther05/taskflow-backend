import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await SubscriptionService.createSubscription(
      userId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Subscription created successfully",
      data: result,
    });
  },
);

const getSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const organizationId =
      req.params.organizationId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const result = await SubscriptionService.getSubscription(
      userId,
      organizationId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription retrieved successfully",
      data: result,
    });
  },
);

const updateSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const subscriptionId =
      req.params.subscriptionId?.toString();

    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    const result = await SubscriptionService.updateSubscription(
      userId,
      subscriptionId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription updated successfully",
      data: result,
    });
  },
);

const cancelSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const subscriptionId =
      req.params.subscriptionId?.toString();

    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    const result = await SubscriptionService.cancelSubscription(
      userId,
      subscriptionId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription cancelled successfully",
      data: result,
    });
  },
);

export const SubscriptionController = {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
};