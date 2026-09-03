import z from "zod";

const RegisterZodSchema = z.object({
	name: z
		.string("Not a valid string")
		.min(3, "Name must be at least 3 characters long")
		.max(50),
	email: z.email("Invalid email format"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
		.regex(/[0-9]/, "Password must contain at least 1 number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
});

const EmailVerifyZodSchema = z.object({
	email: z.email("Invalid email format"),
	otp: z.string().length(6),
});

const LoginZodSchema = z.object({
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

const ForgotPasswordZodSchema = z.object({
	email: z.email(),
});

const ResetPasswordZodSchema = z.object({
	email: z.email(),
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
		.regex(/[0-9]/, "Password must contain at least 1 number")
		.regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character"),
	otp: z.string().length(6),
});

export const AuthValidation = {
	RegisterZodSchema,
	EmailVerifyZodSchema,
	LoginZodSchema,
	ForgotPasswordZodSchema,
	ResetPasswordZodSchema,
};