import { z } from "zod";

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  expiresAt: Date;
}

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
