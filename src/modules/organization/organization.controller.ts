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

export const OrganizationController = {
  createOrganization,
  getMyOrganizations,
  getOrganizationById,
};