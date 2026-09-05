
import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/apiResponse";

import { ProjectService } from "./project.service";

// Create Project
const createProject = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;

    const result = await ProjectService.createProject(
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Project created successfully",
      data: result,
    });
  },
);

// Get Projects By Organization
const getProjectsByOrganization = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const organizationId = req.params.organizationId?.toString();

    if (!organizationId) {
      throw new Error("Organization ID is required");
    }

    const result =
      await ProjectService.getProjectsByOrganization(
        organizationId,
        userId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Projects retrieved successfully",
      data: result,
    });
  },
);

// Get Project By ID
const getProjectById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const projectId = req.params.projectId?.toString();

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const result = await ProjectService.getProjectById(
      projectId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project retrieved successfully",
      data: result,
    });
  },
);

// Update Project
const updateProject = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const projectId = req.params.projectId?.toString();

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const result = await ProjectService.updateProject(
      projectId,
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  },
);

// Delete / Archive Project
const deleteProject = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const projectId = req.params.projectId?.toString();

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const result = await ProjectService.deleteProject(
      projectId,
      userId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Project archived successfully",
      data: result,
    });
  },
);

export const ProjectController = {
  createProject,
  getProjectsByOrganization,
  getProjectById,
  updateProject,
  deleteProject,
};
