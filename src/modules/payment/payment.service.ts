import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

import config from "../../config";
import Stripe from "stripe";
import { ICreatePaymentPayload } from "./payment.interface";
import ApiError from "../../utils/ApiError";

// Create Payment + Stripe Checkout
const createPaymentIntoDB = async (
  userId: string,
  payload: ICreatePaymentPayload,
) => {
  const {
    organizationId,
    subscriptionId,
    plan,
    amount,
    currency,
  } = payload;

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization",
    );
  }

  if (membership.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Only ADMIN can make payment",
    );
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      id: subscriptionId,
    },
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  if (subscription.organizationId !== organizationId) {
    throw new ApiError(
      400,
      "Subscription does not belong to this organization",
    );
  }

  if (subscription.plan !== plan) {
    throw new ApiError(
      400,
      "Payment plan does not match subscription plan",
    );
  }

  const transactionId = uuidv4();

  const payment = await prisma.payment.create({
    data: {
      amount,
      currency: currency.toUpperCase(),
      gateway: "STRIPE",
      status: "PENDING",
      transactionId,
      plan,
      organizationId,
      subscriptionId,
      userId,
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),

            product_data: {
              name: `TaskFlow ${plan} Subscription`,
            },

            unit_amount: Math.round(amount * 100),
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      success_url:
        `${config.app_url}/payment-success` +
        `?transactionId=${transactionId}`,

      cancel_url:
        `${config.app_url}/payment-cancel` +
        `?transactionId=${transactionId}`,

      metadata: {
        paymentId: payment.id,
        transactionId,
        organizationId,
        subscriptionId,
        plan,
      },
    });

    return {
      payment,
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "FAILED",
      },
    });

    throw error;
  }
};

// Confirm Payment
const confirmPaymentIntoDB = async (
  transactionId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  // Webhook retry করলে error না দিয়ে success response দিতে হবে
  if (payment.status === "SUCCESS") {
    return payment;
  }

  if (payment.status !== "PENDING") {
    throw new ApiError(
      400,
      "Payment cannot be confirmed",
    );
  }

  const updatedPayment = await prisma.payment.update({
    where: {
      transactionId,
    },
    data: {
      status: "SUCCESS",
    },
  });

  if (payment.subscriptionId) {
    await prisma.subscription.update({
      where: {
        id: payment.subscriptionId,
      },
      data: {
        isActive: true,
        endDate: null,
      },
    });
  }

  return updatedPayment;
};

// Stripe Webhook
const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string,
) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret!,
    );
  } catch  {
    throw new ApiError(
      400,
      "Invalid Stripe webhook signature",
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const transactionId =
        session.metadata?.transactionId;

      if (!transactionId) {
        throw new ApiError(
          400,
          "Transaction ID not found in Stripe metadata",
        );
      }

      await confirmPaymentIntoDB(transactionId);

      break;
    }

    default:
      console.log(
        `Unhandled Stripe event: ${event.type}`,
      );
  }

  return {
    received: true,
  };
};

// Get My Payments
const getMyPaymentsFromDB = async (
  userId: string,
) => {
  const payments = await prisma.payment.findMany({
    where: {
      userId,
    },

    include: {
      organization: true,
      subscription: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

// Get Payment By ID
const getPaymentByIdFromDB = async (
  paymentId: string,
  userId: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    include: {
      organization: true,
      subscription: true,
    },
  });

  if (!payment) {
    throw new ApiError(
      404,
      "Payment not found",
    );
  }

  if (payment.userId !== userId) {
    throw new ApiError(
      403,
      "You cannot access this payment",
    );
  }

  return payment;
};

export const paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  handleStripeWebhook,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};