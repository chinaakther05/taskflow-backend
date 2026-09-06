import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import { ICreateActivityPayload } from "./activity.interface";

const createActivity = async (
  userId: string,
  payload: ICreateActivityPayload,
) => {
  const {
    action,
    details,
    organizationId,
    projectId,
    taskId,
  } = payload;

  // Check organization membership
  const membership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  // Check project if provided
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (project.organizationId !== organizationId) {
      throw new ApiError(
        400,
        "Project does not belong to this organization",
      );
    }
  }

  // Check task if provided
  if (taskId) {
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

    if (task.project.organizationId !== organizationId) {
      throw new ApiError(
        400,
        "Task does not belong to this organization",
      );
    }
  }

  const activity = await prisma.activity.create({
    data: {
      action,
      details,
      organizationId,
      projectId,
      taskId,
      userId,
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
  });

  return activity;
};

const getActivitiesByOrganization = async (
  userId: string,
  organizationId: string,
) => {
  const membership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  const activities = await prisma.activity.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
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
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return activities;
};

const getActivitiesByTask = async (
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

  const membership =
    await prisma.organizationMember.findUnique({
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

  const activities = await prisma.activity.findMany({
    where: {
      taskId,
    },
    orderBy: {
      createdAt: "desc",
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
  });

  return activities;
};

const getActivityById = async (
  userId: string,
  activityId: string,
) => {
  const activity = await prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    include: {
      organization: true,
      project: true,
      task: true,
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

  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  const membership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: activity.organizationId,
        },
      },
    });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  return activity;
};

export const ActivityService = {
  createActivity,
  getActivitiesByOrganization,
  getActivitiesByTask,
  getActivityById,
};