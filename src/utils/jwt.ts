import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

interface IVerifyTokenResult {
  success: boolean;
  data?: JwtPayload | string;
  error?: string;
}

const verifyToken = (
  token: string,
  secret: Secret,
): IVerifyTokenResult => {
  try {
    const decoded = jwt.verify(token, secret);

    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid token",
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};