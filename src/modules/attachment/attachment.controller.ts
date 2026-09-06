import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { AttachmentService } from "./attachment.service";

const createAttachment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await AttachmentService.createAttachment(
      userId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Attachment created successfully",
      data: result,
    });
  },
);

const getAttachmentsByTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await AttachmentService.getAttachmentsByTask(
      userId,
      taskId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Attachments retrieved successfully",
      data: result,
    });
  },
);

const getAttachmentById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const attachmentId = req.params.attachmentId?.toString();

    if (!attachmentId) {
      throw new Error("Attachment ID is required");
    }

    const result = await AttachmentService.getAttachmentById(
      userId,
      attachmentId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Attachment retrieved successfully",
      data: result,
    });
  },
);

const deleteAttachment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const attachmentId = req.params.attachmentId?.toString();

    if (!attachmentId) {
      throw new Error("Attachment ID is required");
    }

    const result = await AttachmentService.deleteAttachment(
      userId,
      attachmentId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Attachment deleted successfully",
      data: result,
    });
  },
);

export const AttachmentController = {
  createAttachment,
  getAttachmentsByTask,
  getAttachmentById,
  deleteAttachment,
};