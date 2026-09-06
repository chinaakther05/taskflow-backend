import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/apiResponse";

// Create Payment
const createPayment = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId as string;

  const result = await paymentService.createPaymentIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
};

// Confirm Payment
const confirmPayment = async (
  req: Request,
  res: Response,
) => {
  const transactionId = req.params.transactionId as string;

  const result =
    await paymentService.confirmPaymentIntoDB(
      transactionId,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment confirmed successfully",
    data: result,
  });
};

// Stripe Webhook
const handleStripeWebhook = async (
  req: Request,
  res: Response,
) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({
      success: false,
      message: "Stripe signature is missing",
    });
  }

  const result =
    await paymentService.handleStripeWebhook(
      req.body,
      signature,
    );

  res.status(200).json(result);
};

// Get My Payments
const getMyPayments = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId as string;

  const result =
    await paymentService.getMyPaymentsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
};

// Get Payment By ID
const getPaymentById = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId as string;
  const { paymentId } = req.params;

  const result =
    await paymentService.getPaymentByIdFromDB(
      paymentId as string,
      userId,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
};

export const PaymentController = {
  createPayment,
  confirmPayment,
  handleStripeWebhook,
  getMyPayments,
  getPaymentById,
};