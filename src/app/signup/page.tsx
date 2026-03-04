"use client";

import {
  Anchor,
  Button,
  Container,
  List,
  ListItem,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <Container size={420} py={80}>
      <Title ta="center" order={1}>
        Create an account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} href="/login" size="sm">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={action}>
          <Stack gap="md">
            <TextInput
              name="name"
              label="Name"
              placeholder="Your full name"
              required
              error={state?.errors?.name?.[0]}
            />

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

            {state?.errors?.password && (
              <List size="sm" c="red">
                {state.errors.password.map((error) => (
                  <ListItem key={error}>{error}</ListItem>
                ))}
              </List>
            )}

            {state?.message && (
              <Text c="red" size="sm" ta="center">
                {state.message}
              </Text>
            )}

            <Button type="submit" fullWidth loading={pending}>
              Sign up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
