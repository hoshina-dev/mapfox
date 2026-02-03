import { Flex, Text, Title } from "@mantine/core";

import classes from "./Welcome.module.css";

export function Welcome() {
  return (
    <Flex direction="column" align="center">
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          Mapfox Demo
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Please see below for available feature demos.
      </Text>
    </Flex>
  );
}
