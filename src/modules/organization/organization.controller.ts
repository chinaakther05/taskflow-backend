import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";
import { OrganizationService } from "./organization.service";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await OrganizationService.createOrganization(
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Organization created successfully",
    data: result,
  });
});

const getMyOrganizations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await OrganizationService.getMyOrganizations(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organizations retrieved successfully",
    data: result,
  });
});

const getOrganizationById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string;   // ✅ 'as string' যোগ করা হলো

  const result = await OrganizationService.getOrganizationById(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization retrieved successfully",
    data: result,
  });
});

const updateOrganization = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await OrganizationService.updateOrganization(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization updated successfully",
    data: result,
  });
});

const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const result = await OrganizationService.deleteOrganization(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organization deleted successfully",
    data: result,
  });
});

// Invite Member
const inviteMember = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const result = await OrganizationService.inviteMember(
      organizationId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Member invited successfully",
      data: result,
    });
  },
);

// Remove Member
const removeMember = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId?.toString();
    const memberUserId = req.params.memberUserId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    if (!memberUserId) {
      throw new Error("Member user ID is required");
    }

    const result = await OrganizationService.removeMember(
      organizationId,
      memberUserId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Member removed successfully",
      data: result,
    });
  },
);

export const OrganizationController = {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  removeMember,
};