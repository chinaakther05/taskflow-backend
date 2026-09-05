import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";

import { CommentService } from "./comment.service";

// Create Comment
const createComment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await CommentService.createComment(
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Comment created successfully",
      data: result,
    });
  },
);

// Get Comments By Task
const getCommentsByTask = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const taskId = req.params.taskId?.toString();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const result = await CommentService.getCommentsByTask(
      taskId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comments retrieved successfully",
      data: result,
    });
  },
);

// Get Comment By ID
const getCommentById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const commentId = req.params.commentId?.toString();

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await CommentService.getCommentById(
      commentId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment retrieved successfully",
      data: result,
    });
  },
);

// Update Comment
const updateComment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const commentId = req.params.commentId?.toString();

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await CommentService.updateComment(
      commentId,
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment updated successfully",
      data: result,
    });
  },
);

// Delete Comment
const deleteComment = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const commentId = req.params.commentId?.toString();

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await CommentService.deleteComment(
      commentId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  },
);

export const CommentController = {
  createComment,
  getCommentsByTask,
  getCommentById,
  updateComment,
  deleteComment,
};