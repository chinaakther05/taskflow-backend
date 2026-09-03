import { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  res.status(400).json({
    success: false,
    message: error.message || "Something went wrong",
    errors: [],
  });
};

export default errorHandler;