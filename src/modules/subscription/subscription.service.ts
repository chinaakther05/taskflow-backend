import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";

import {
  ICreateSubscriptionPayload,
  IUpdateSubscriptionPayload,
} from "./subscription.interface";

const getPlanLimits = (plan: "FREE" | "PRO" | "BUSINESS") => {
  switch (plan) {
    case "FREE":
      return {
        maxProjects: 3,
        maxMembers: 5,
      };

    case "PRO":
      return {
        maxProjects: 20,
        maxMembers: 50,
      };

    case "BUSINESS":
      return {
        maxProjects: 100,
        maxMembers: 200,
      };
  }
};

const createSubscription = async (
  userId: string,
  payload: ICreateSubscriptionPayload,
) => {
  const { organizationId, plan } = payload;

  const membership = await prisma.organizationMember.findUnique({
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

  if (
    membership.role !== "ADMIN" &&
    membership.role !== "PROJECT_MANAGER"
  ) {
    throw new ApiError(
      403,
      "Only ADMIN or PROJECT_MANAGER can create a subscription",
    );
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      organizationId,
    },
  });

  if (existingSubscription) {
    throw new ApiError(
      409,
      "This organization already has a subscription",
    );
  }

  const limits = getPlanLimits(plan);

  const subscription = await prisma.subscription.create({
    data: {
      organizationId,
      plan,
      maxProjects: limits.maxProjects,
      maxMembers: limits.maxMembers,
      isActive: true,
      startDate: new Date(),
    },
  });

  return subscription;
};

const getSubscription = async (
  userId: string,
  organizationId: string,
) => {
  const membership = await prisma.organizationMember.findUnique({
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

  const subscription = await prisma.subscription.findUnique({
    where: {
      organizationId,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  return subscription;
};

const updateSubscription = async (
  userId: string,
  subscriptionId: string,
  payload: IUpdateSubscriptionPayload,
) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id: subscriptionId,
    },
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: subscription.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  if (
    membership.role !== "ADMIN" &&
    membership.role !== "PROJECT_MANAGER"
  ) {
    throw new ApiError(
      403,
      "Only ADMIN or PROJECT_MANAGER can update subscription",
    );
  }

  const updateData: IUpdateSubscriptionPayload = {
    ...payload,
  };

  if (payload.plan) {
    const limits = getPlanLimits(payload.plan);

    updateData.maxProjects = limits.maxProjects;
    updateData.maxMembers = limits.maxMembers;
  }

  const updatedSubscription = await prisma.subscription.update({
    where: {
      id: subscriptionId,
    },
    data: updateData,
  });

  return updatedSubscription;
};

const cancelSubscription = async (
  userId: string,
  subscriptionId: string,
) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id: subscriptionId,
    },
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: subscription.organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  if (membership.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Only ADMIN can cancel the subscription",
    );
  }

  const cancelledSubscription = await prisma.subscription.update({
    where: {
      id: subscriptionId,
    },
    data: {
      isActive: false,
      endDate: new Date(),
    },
  });

  return cancelledSubscription;
};

export const SubscriptionService = {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
};