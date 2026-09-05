
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/ApiError";
import { ICreateProjectPayload, IUpdateProjectPayload } from "./project.interface";

// 🔧 Helper: Organization membership + role check - একবার লিখে বারবার ব্যবহার হবে
const ensureOrgAccess = async (
  userId: string,
  organizationId: string,
  allowedRoles?: string[]
) => {
  const membership = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  });

  if (!membership) {
    throw new ApiError(403, "You are not a member of this organization");
  }

  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }

  return membership;
};

// 🔧 Helper: Project খুঁজে বের করা, না পেলে 404
const findProjectOrThrow = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const createProject = async (payload: ICreateProjectPayload, userId: string) => {
  const { organizationId, ...projectData } = payload;

  await ensureOrgAccess(userId, organizationId, ["ADMIN", "PROJECT_MANAGER"]);

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { ...projectData, organizationId, ownerId: userId },
    });

    await tx.projectMember.create({
      data: { projectId: project.id, userId, permission: "FULL" },
    });

    return project;
  });

  return result;
};

const getProjectsByOrganization = async (organizationId: string, userId: string) => {
  await ensureOrgAccess(userId, organizationId);

  return prisma.project.findMany({
    where: { organizationId, status: { not: "ARCHIVED" } },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await ensureOrgAccess(userId, project.organizationId);

  return project;
};

const updateProject = async (
  projectId: string,
  payload: IUpdateProjectPayload,
  userId: string
) => {
  const project = await findProjectOrThrow(projectId);

  await ensureOrgAccess(userId, project.organizationId, [
    "ADMIN",
    "PROJECT_MANAGER",
  ]);

  return prisma.project.update({ where: { id: projectId }, data: payload });
};

const deleteProject = async (projectId: string, userId: string) => {
  const project = await findProjectOrThrow(projectId);

  await ensureOrgAccess(userId, project.organizationId, [
    "ADMIN",
    "PROJECT_MANAGER",
  ]);

  // Soft delete
  return prisma.project.update({
    where: { id: projectId },
    data: { status: "ARCHIVED" },
  });
};

export const ProjectService = {
  createProject,
  getProjectsByOrganization,
  getProjectById,
  updateProject,
  deleteProject,
};