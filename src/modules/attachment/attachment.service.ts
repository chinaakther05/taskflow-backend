import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import { ICreateAttachmentPayload } from "./attachment.interface";

const createAttachment = async (
  userId: string,
  payload: ICreateAttachmentPayload,
) => {
  const { taskId, fileUrl, fileName, fileType } = payload;

  // Check task
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

  // Create attachment
  const attachment = await prisma.attachment.create({
    data: {
      taskId,
      fileUrl,
      fileName,
      fileType,
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          projectId: true,
        },
      },
    },
  });

  return attachment;
};

const getAttachmentsByTask = async (
  userId: string,
  taskId: string,
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

  const attachments = await prisma.attachment.findMany({
    where: {
      taskId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return attachments;
};

const getAttachmentById = async (
  userId: string,
  attachmentId: string,
) => {
  const attachment = await prisma.attachment.findUnique({
    where: {
      id: attachmentId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  // Check organization membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: attachment.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  return attachment;
};

const deleteAttachment = async (
  userId: string,
  attachmentId: string,
) => {
  const attachment = await prisma.attachment.findUnique({
    where: {
      id: attachmentId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!attachment) {
    throw new ApiError(404, "Attachment not found");
  }

  // Check organization membership
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: attachment.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  await prisma.attachment.delete({
    where: {
      id: attachmentId,
    },
  });

  return {
    message: "Attachment deleted successfully",
  };
};

export const AttachmentService = {
  createAttachment,
  getAttachmentsByTask,
  getAttachmentById,
  deleteAttachment,
};