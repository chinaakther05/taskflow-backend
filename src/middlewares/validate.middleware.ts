import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import sendResponse from "../utils/apiResponse";

const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "Validation error",
          data: errors,
        });
      }

      next(error);
    }
  };
};

export default validateRequest;