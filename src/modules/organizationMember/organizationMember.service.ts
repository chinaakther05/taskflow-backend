import { prisma } from "../../lib/prisma";

interface IAddMemberPayload {
  userId: string;
  organizationId: string;
  role?: "PROJECT_MANAGER" | "MEMBER";
}

const addMember = async (
  requesterId: string,
  payload: IAddMemberPayload,
) => {
  const { userId, organizationId, role = "MEMBER" } = payload;

  const requester = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId,
      },
    },
  });

  if (!requester) {
    throw new Error("You are not a member of this organization");
  }

  if (requester.role !== "ADMIN") {
    throw new Error("Only ADMIN can add organization members");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingMember = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this organization");
  }

  return prisma.organizationMember.create({
    data: {
      userId,
      organizationId,
      role,
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
};

const getOrganizationMembers = async (
  requesterId: string,
  organizationId: string,
) => {
  const requester = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId,
      },
    },
  });

  if (!requester) {
    throw new Error("You are not a member of this organization");
  }

  return prisma.organizationMember.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          isActive: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};

const updateMemberRole = async (
  requesterId: string,
  memberId: string,
  role: "PROJECT_MANAGER" | "MEMBER",
) => {
  const member = await prisma.organizationMember.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    throw new Error("Organization member not found");
  }

  const requester = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId: member.organizationId,
      },
    },
  });

  if (!requester || requester.role !== "ADMIN") {
    throw new Error("Only ADMIN can update member role");
  }

  return prisma.organizationMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
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
};

const removeMember = async (
  requesterId: string,
  memberId: string,
) => {
  const member = await prisma.organizationMember.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    throw new Error("Organization member not found");
  }

  const requester = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId: member.organizationId,
      },
    },
  });

  if (!requester || requester.role !== "ADMIN") {
    throw new Error("Only ADMIN can remove members");
  }

  if (member.role === "ADMIN") {
    throw new Error("Organization ADMIN cannot be removed");
  }

  return prisma.organizationMember.delete({
    where: {
      id: memberId,
    },
  });
};

export const OrganizationMemberService = {
  addMember,
  getOrganizationMembers,
  updateMemberRole,
  removeMember,
};