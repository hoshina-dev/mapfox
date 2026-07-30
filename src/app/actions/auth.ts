"use server";

import { redirect } from "next/navigation";

import { ResponseError } from "@/libs/api/custapi";
import { usersApi } from "@/libs/apiClient";
import {
  LoginFormSchema,
  LoginFormState,
  SignupFormSchema,
  SignupFormState,
} from "@/libs/definitions";
import { createSession, deleteSession } from "@/libs/session";

export async function signup(
  state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  // 2. Check if user already exists
  try {
    await usersApi.usersEmailEmailGet(email);
    return {
      message: "An account with this email already exists.",
    };
  } catch {
    // User doesn't exist, continue
  }

  // 3. Create the user in CustAPI
  let user;
  try {
    user = await usersApi.usersPost({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      console.error(await error.response.text());
    }

    return {
      message:
        "An error occurred while creating your account. Please try again.",
    };
  }

  // 4. Create session
  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  });

  // 5. Redirect
  redirect("/");
}

export async function login(
  state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 2. Verify credentials inside CustAPI (POST /auth/verify) so the bcrypt
  // hash never crosses the service boundary. Returns the user on success,
  // 401 on bad email/password — treat any failure uniformly.
  let user;
  try {
    user = await usersApi.authVerifyPost({ email, password });
  } catch {
    return {
      message: "Invalid email or password.",
    };
  }

  // 3. Create session
  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
  });

  // 4. Redirect
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
