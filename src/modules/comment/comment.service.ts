import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

// Create Comment
const createComment = async (
  payload: ICreateCommentPayload,
  userId: string,
) => {
  const { taskId, content } = payload;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check organization membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  return comment;
};

// Get Comments By Task
const getCommentsByTask = async (
  taskId: string,
  userId: string,
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const comments = await prisma.comment.findMany({
    where: {
      taskId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
};

// Get Comment By ID
const getCommentById = async (
  commentId: string,
  userId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: comment.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  return comment;
};

// Update Comment
const updateComment = async (
  commentId: string,
  payload: IUpdateCommentPayload,
  userId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: comment.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const isManager =
    membership.role === "ADMIN" ||
    membership.role === "PROJECT_MANAGER";

  const isAuthor = comment.authorId === userId;

  if (!isManager && !isAuthor) {
    throw new ApiError(
      403,
      "You do not have permission to update this comment",
    );
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  return updatedComment;
};

// Delete Comment
const deleteComment = async (
  commentId: string,
  userId: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: comment.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const isManager =
    membership.role === "ADMIN" ||
    membership.role === "PROJECT_MANAGER";

  const isAuthor = comment.authorId === userId;

  if (!isManager && !isAuthor) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment",
    );
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    id: commentId,
  };
};

export const CommentService = {
  createComment,
  getCommentsByTask,
  getCommentById,
  updateComment,
  deleteComment,
};