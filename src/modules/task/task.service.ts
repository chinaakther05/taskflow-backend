import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import {
  ICreateTaskPayload,
  IUpdateTaskPayload,
} from "./task.interface";

// Create Task
const createTask = async (
  payload: ICreateTaskPayload,
  userId: string,
) => {
  const { projectId, assigneeId, ...taskData } = payload;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  // Only ADMIN and PROJECT_MANAGER can create tasks
  if (
    membership.role !== "ADMIN" &&
    membership.role !== "PROJECT_MANAGER"
  ) {
    throw new ApiError(
      403,
      "You do not have permission to create a task",
    );
  }

  // Check assignee organization membership
  if (assigneeId) {
    const assignee = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: assigneeId,
          organizationId: project.organizationId,
        },
      },
    });

    if (!assignee) {
      throw new ApiError(
        400,
        "Assignee must be a member of this organization",
      );
    }
  }

  const task = await prisma.task.create({
    data: {
      ...taskData,
      projectId,
      assigneeId,
      creatorId: userId,
    },
  });

  return task;
};

// Get Tasks By Project
const getTasksByProject = async (
  projectId: string,
  userId: string,
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: project.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
          timeLogs: true,
          attachments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
};

// Get Task By ID
const getTaskById = async (
  taskId: string,
  userId: string,
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: true,
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: true,
      timeLogs: true,
      attachments: true,
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

  return task;
};

// Update Task
const updateTask = async (
  taskId: string,
  payload: IUpdateTaskPayload,
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

  const isManager =
    membership.role === "ADMIN" ||
    membership.role === "PROJECT_MANAGER";

  const isAssignedMember =
    membership.role === "MEMBER" &&
    task.assigneeId === userId;

  if (!isManager && !isAssignedMember) {
    throw new ApiError(
      403,
      "You do not have permission to update this task",
    );
  }

  // MEMBER can update only status
  if (
    membership.role === "MEMBER" &&
    (payload.title !== undefined ||
      payload.description !== undefined ||
      payload.priority !== undefined ||
      payload.assigneeId !== undefined ||
      payload.deadline !== undefined)
  ) {
    throw new ApiError(
      403,
      "Members can only update task status",
    );
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: payload,
  });

  return updatedTask;
};

// Delete Task
const deleteTask = async (
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

  // Only ADMIN and PROJECT_MANAGER can delete tasks
  if (
    membership.role !== "ADMIN" &&
    membership.role !== "PROJECT_MANAGER"
  ) {
    throw new ApiError(
      403,
      "You do not have permission to delete this task",
    );
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return {
    id: taskId,
  };
};

export const TaskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};