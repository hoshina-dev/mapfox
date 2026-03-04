"use client";

import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <Container size={420} py={80}>
      <Title ta="center" order={1}>
        Welcome back
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don&apos;t have an account?{" "}
        <Anchor component={Link} href="/signup" size="sm">
          Sign up
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={action}>
          <Stack gap="md">
            <TextInput
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              required
              error={state?.errors?.email?.[0]}
            />

            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              required
              error={state?.errors?.password?.[0]}
            />

            {state?.message && (
              <Text c="red" size="sm" ta="center">
                {state.message}
              </Text>
            )}

            <Button type="submit" fullWidth loading={pending}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
