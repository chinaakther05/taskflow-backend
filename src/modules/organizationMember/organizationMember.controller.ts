import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";

import { OrganizationMemberService } from "./organizationMember.service";

const addMember = catchAsync(async (req: Request, res: Response) => {
  const requesterId = req.user?.userId as string;

  const result = await OrganizationMemberService.addMember(
    requesterId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Member added successfully",
    data: result,
  });
});

const getOrganizationMembers = catchAsync(
  async (req: Request, res: Response) => {
    const requesterId = req.user?.userId as string;

    const organizationId = req.params.organizationId;

    if (!organizationId || Array.isArray(organizationId)) {
      throw new Error("Invalid organization ID");
    }

    const result =
      await OrganizationMemberService.getOrganizationMembers(
        requesterId,
        organizationId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Organization members retrieved successfully",
      data: result,
    });
  },
);

const updateMemberRole = catchAsync(
  async (req: Request, res: Response) => {
    const memberId = req.params.memberId?.toString();

    if (!memberId) {
      throw new Error("Member ID is required");
    }

    const { role } = req.body;
    const requesterId = req.user?.userId as string;

    const result = await OrganizationMemberService.updateMemberRole(
      requesterId,
      memberId,
      role,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Member role updated successfully",
      data: result,
    });
  },
);
const removeMember = catchAsync(
  async (req: Request, res: Response) => {
    const requesterId = req.user?.userId as string;
    const memberId = req.params.memberId?.toString();

    if (!memberId) {
      throw new Error("Member ID is required");
    }

    const result = await OrganizationMemberService.removeMember(
      requesterId,
      memberId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Member removed successfully",
      data: result,
    });
  },
);

export const OrganizationMemberController = {
  addMember,
  getOrganizationMembers,
  updateMemberRole,
  removeMember,
};