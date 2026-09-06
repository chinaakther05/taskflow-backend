import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { IInviteMemberPayload } from "./organization.interface";


interface ICreateOrganizationPayload {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

interface IUpdateOrganizationPayload {
  name?: string;
  logo?: string;
  description?: string;
}

const createOrganization = async (
  payload: ICreateOrganizationPayload,
  userId: string
) => {
  // Slug আগে থেকে ব্যবহার হয়ে আছে কিনা check
  const existingOrg = await prisma.organization.findUnique({
    where: { slug: payload.slug },
  });

  if (existingOrg) {
    throw new ApiError(400, "This slug is already taken, choose another one");
  }

  // Transaction: Organization তৈরি + Creator কে ADMIN বানানো - দুটোই একসাথে সফল হবে, নাহলে দুটোই বাতিল
  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        logo: payload.logo,
        description: payload.description,
      },
    });

    await tx.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: userId,
        role: "ADMIN",
      },
    });

    return organization;
  });

  return result;
};

const getMyOrganizations = async (userId: string) => {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: {
      organization: true,
    },
  });

  return memberships.map((m) => ({
    ...m.organization,
    myRole: m.role,
  }));
};

const getOrganizationById = async (organizationId: string, userId: string) => {
  // User এই organization এর member কিনা check
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {   // ✅ ঠিক করা হলো - তোমার schema এর order অনুযায়ী
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(403, "You are not a member of this organization");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  return organization;
};

const updateOrganization = async (
  organizationId: string,
  payload: IUpdateOrganizationPayload
) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  const updated = await prisma.organization.update({
    where: { id: organizationId },
    data: payload,
  });

  return updated;
};

const deleteOrganization = async (organizationId: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // Soft delete - পুরোপুরি মুছে ফেলা হচ্ছে না, শুধু inactive করা হচ্ছে
  const deleted = await prisma.organization.update({
    where: { id: organizationId },
    data: { isActive: false },
  });

  return deleted;
};

const inviteMember = async (
  organizationId: string,
  payload: IInviteMemberPayload,
) => {
  const { email, role } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "No user found with this email. Ask them to register first.",
    );
  }

  const existingMembership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId,
        },
      },
    });

  if (existingMembership) {
    throw new ApiError(
      400,
      "This user is already a member of this organization",
    );
  }

  const membership =
    await prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        role: role || "MEMBER",
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

  return membership;
};

const removeMember = async (
  organizationId: string,
  memberUserId: string,
) => {
  const membership =
    await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: memberUserId,
          organizationId,
        },
      },
    });

  if (!membership) {
    throw new ApiError(
      404,
      "Member not found in this organization",
    );
  }

  await prisma.organizationMember.delete({
    where: {
      id: membership.id,
    },
  });

  return {
    message: "Member removed successfully",
  };
};

export const OrganizationService = {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  removeMember,
};
