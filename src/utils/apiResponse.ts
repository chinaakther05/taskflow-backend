import { Response } from "express";

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(res: Response, response: IApiResponse<T>) => {
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data || null,
  });
};

export default sendResponse;