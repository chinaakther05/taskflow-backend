import bcrypt from "bcrypt";
import type { SignOptions } from "jsonwebtoken";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";

interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

interface ILoginUserPayload {
  email: string;
  password: string;
}

const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, password } = payload;

  const email = payload.email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      googleId: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { password } = payload;

  const email = payload.email.trim().toLowerCase();

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check active account
  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  // Google-only account
  if (!user.password && user.googleId) {
    throw new Error(
      "This account was registered with Google. Please login with Google.",
    );
  }

  if (!user.password) {
    throw new Error("Password is not set for this account");
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // JWT payload
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
  };

  // Create access token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions["expiresIn"],
  );

  // Create refresh token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions["expiresIn"],
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};