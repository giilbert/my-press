import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { ShellSidebarDrawer } from "./stream-shell";

export const StreamHeading: React.FC<
  React.PropsWithChildren<{ text: string }>
> = (props) => {
  return (
    <Flex
      p={4}
      w="full"
      borderBottom="solid 1px"
      borderBottomColor="gray.600"
      alignItems="center"
      gap="2"
    >
      <ShellSidebarDrawer />
      <Heading fontWeight="semibold" fontSize="large">
        {props.text}
      </Heading>
    </Flex>
  );
};
