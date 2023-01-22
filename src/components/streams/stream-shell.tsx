import {
  Box,
  Button,
  Flex,
  Stack,
  Divider,
  Text,
  HStack,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/api";
import { DefaultQueryCell } from "../utils/default-query-cell";
import { CreateStream } from "./create-stream";
import { StreamProvider } from "./stream-provider";

interface Props {
  viewingAll?: boolean;
}

const Sidebar: React.FC<Props> = (props) => {
  const streams = trpc.stream.getJoinedStreams.useQuery();
  const router = useRouter();
  const session = useSession({ required: true });

  return (
    <Box borderRight="solid 1px" borderRightColor="gray.600" h="100vh" p="4">
      <Stack w="15rem">
        <CreateStream />
        <Button
          size="sm"
          variant={props.viewingAll ? "solid" : "ghost"}
          as={Link}
          href="/dashboard"
        >
          View All
        </Button>
        <Divider />
        <DefaultQueryCell
          query={streams}
          success={({ data }) => (
            <>
              <Text fontWeight="bold" fontSize="0.9rem" color="whiteAlpha.600">
                Subscribed
              </Text>
              {data
                .filter((stream) => stream.members[0]?.permission === "MEMBER")
                .map((stream) => (
                  <Button
                    key={stream.id}
                    size="sm"
                    variant={
                      router.query.slug === stream.slug ? "solid" : "ghost"
                    }
                    as={Link}
                    href={`/stream/${stream.slug}`}
                  >
                    <Text
                      w="100%"
                      textAlign="left"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {stream.name}
                    </Text>
                  </Button>
                ))}
              <Divider />
              <Text fontWeight="bold" fontSize="0.9rem" color="whiteAlpha.600">
                Owned
              </Text>
              {data
                .filter((stream) => stream.members[0]?.permission !== "MEMBER")
                .map((stream) => (
                  <Button
                    key={stream.id}
                    size="sm"
                    variant={
                      router.query.slug === stream.slug ? "solid" : "ghost"
                    }
                    as={Link}
                    href={`/stream/${stream.slug}`}
                  >
                    <Text
                      w="100%"
                      textAlign="left"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {stream.name}
                    </Text>
                  </Button>
                ))}
            </>
          )}
        />
      </Stack>

      <hr
        style={{
          marginTop: "2rem",
        }}
      />

      <HStack w="full" mt="4">
        <Text fontWeight="bold">{session.data?.user?.name}</Text>
        <Button
          size="sm"
          ml="auto !important"
          bgColor="red.500"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </HStack>
    </Box>
  );
};

export const StreamShell: React.FC<React.PropsWithChildren<Props>> = (
  props
) => {
  return (
    <Flex h="100vh" overflow="hidden">
      <Box>
        <Sidebar viewingAll={props.viewingAll} />
      </Box>
      <Flex w="full" overflow="auto">
        {props.viewingAll && props.children}
        {!props.viewingAll && <StreamProvider>{props.children}</StreamProvider>}
      </Flex>
    </Flex>
  );
};
