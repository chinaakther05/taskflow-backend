import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";


import {
  ICreateTimeLogPayload,
  IUpdateTimeLogPayload,
} from "./timeLog.interface";

const createTimeLog = async (
  userId: string,
  payload: ICreateTimeLogPayload,
) => {
  const { taskId, startTime, endTime, duration, note } = payload;

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

  // Create time log
  const timeLog = await prisma.timeLog.create({
    data: {
      taskId,
      userId,
      startTime,
      endTime,
      duration,
      note,
    },
  });

  return timeLog;
};

const getTimeLogsByTask = async (
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

  const timeLogs = await prisma.timeLog.findMany({
    where: {
      taskId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return timeLogs;
};

const getTimeLogById = async (
  userId: string,
  timeLogId: string,
) => {
  const timeLog = await prisma.timeLog.findUnique({
    where: {
      id: timeLogId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!timeLog) {
    throw new ApiError(404, "Time log not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: timeLog.task.project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  return timeLog;
};

const updateTimeLog = async (
  userId: string,
  timeLogId: string,
  payload: IUpdateTimeLogPayload,
) => {
  const timeLog = await prisma.timeLog.findUnique({
    where: {
      id: timeLogId,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!timeLog) {
    throw new ApiError(404, "Time log not found");
  }

  // Only the owner of the time log can update it
  if (timeLog.userId !== userId) {
    throw new ApiError(
      403,
      "You can only update your own time log",
    );
  }

  const updatedTimeLog = await prisma.timeLog.update({
    where: {
      id: timeLogId,
    },
    data: payload,
  });

  return updatedTimeLog;
};

const deleteTimeLog = async (
  userId: string,
  timeLogId: string,
) => {
  const timeLog = await prisma.timeLog.findUnique({
    where: {
      id: timeLogId,
    },
  });

  if (!timeLog) {
    throw new ApiError(404, "Time log not found");
  }

  // Only the owner can delete the time log
  if (timeLog.userId !== userId) {
    throw new ApiError(
      403,
      "You can only delete your own time log",
    );
  }

  await prisma.timeLog.delete({
    where: {
      id: timeLogId,
    },
  });

  return {
    message: "Time log deleted successfully",
  };
};

export const TimeLogService = {
  createTimeLog,
  getTimeLogsByTask,
  getTimeLogById,
  updateTimeLog,
  deleteTimeLog,
};