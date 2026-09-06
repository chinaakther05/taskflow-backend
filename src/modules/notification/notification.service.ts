import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import { ICreateNotificationPayload } from "./notification.interface";

const createNotification = async (
  requesterId: string,
  payload: ICreateNotificationPayload,
) => {
  const {
    type,
    title,
    message,
    organizationId,
    userId,
  } = payload;

  // Check requester membership
  const requesterMembership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: requesterId,
          organizationId,
        },
      },
    });

  if (!requesterMembership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  // Check notification receiver
  const receiverMembership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

  if (!receiverMembership) {
    throw new ApiError(
      404,
      "Notification receiver is not a member of this organization",
    );
  }

  const notification =
    await prisma.notification.create({
      data: {
        type,
        title,
        message,
        organizationId,
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
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  return notification;
};

const getMyNotifications = async (
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

  const notifications =
    await prisma.notification.findMany({
      where: {
        userId,
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return notifications;
};

const getNotificationById = async (
  userId: string,
  notificationId: string,
) => {
  const notification =
    await prisma.notification.findUnique({
      where: {
        id: notificationId,
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
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.userId !== userId) {
    throw new ApiError(
      403,
      "You can only access your own notifications",
    );
  }

  return notification;
};

const markAsRead = async (
  userId: string,
  notificationId: string,
) => {
  const notification =
    await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.userId !== userId) {
    throw new ApiError(
      403,
      "You can only update your own notifications",
    );
  }

  const updatedNotification =
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

  return updatedNotification;
};

export const NotificationService = {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markAsRead,
};