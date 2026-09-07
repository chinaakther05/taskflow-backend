import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

import type { SignOptions } from "jsonwebtoken";

import config from "../../config";

import { prisma } from "../../lib/prisma";

import { jwtUtils } from "../../utils/jwt";
import { IGoogleLoginPayload, ILoginUserPayload, IRegisterUserPayload } from "./auth.interface";



const googleClient = new OAuth2Client(config.google_client_id);

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
  const userWithoutPassword = await prisma.user.findUnique({
  where: {
    id: user.id,
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

return {
  user: userWithoutPassword,
  accessToken,
  refreshToken,
};
};



// Google Login
const googleLogin = async (payload: IGoogleLoginPayload) => {
  let googlePayload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googlePayload = ticket.getPayload();
  } catch {
    throw new Error("Invalid or expired Google ID token");
  }

  if (!googlePayload) {
    throw new Error("Invalid or expired Google ID token");
  }

  if (!googlePayload.sub || !googlePayload.email) {
    throw new Error("Google account information is incomplete");
  }

  const googleId = googlePayload.sub;
  const email = googlePayload.email.trim().toLowerCase();
  const name = googlePayload.name || "Google User";
  const avatar = googlePayload.picture || null;

  // Find existing user by email
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // New Google user
  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        googleId,
        avatar,
        isActive: true,
      },
    });
  } else {
    // Check active account
    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    // Existing user
    // Link Google account if not already linked
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        googleId,
        avatar: avatar || user.avatar,
      },
    });
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
  const userWithoutPassword = await prisma.user.findUnique({
  where: {
    id: user.id,
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

return {
  user: userWithoutPassword,
  accessToken,
  refreshToken,
};
};

export const AuthService = {
  registerUser,
  loginUser,
  googleLogin,
};