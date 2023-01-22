import {
  Box,
  Button,
  Flex,
  Stack,
  Divider,
  Text,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useDisclosure,
  IconButton,
  HStack,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaHamburger } from "react-icons/fa";
import { trpc } from "../../utils/api";
import { useIsMobile } from "../../utils/use-is-mobile";
import { DefaultQueryCell } from "../utils/default-query-cell";
import { CreateStream } from "./create-stream";
import { StreamProvider, useStream } from "./stream-provider";
import { FiMenu } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Head from "next/head";

interface Props {
  viewingAll?: boolean;
}

const Sidebar: React.FC<Props> = (props) => {
  const streams = trpc.stream.getJoinedStreams.useQuery();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <Box borderRight="solid 1px" borderRightColor="gray.600" h="100vh" p="4">
      <Stack maxW={!isMobile ? "64" : undefined} spacing={3}>
        <Stack spacing={4}>
          <HStack spacing={6}>
            <Heading fontWeight="medium" fontSize="large">
              MyPress
            </Heading>
            <Button
              size="sm"
              onClick={() => {
                void signOut({ callbackUrl: "/" });
              }}
            >
              Sign Out
            </Button>
          </HStack>
          <CreateStream />
        </Stack>
        <Divider />
        <Button
          size="sm"
          variant={props.viewingAll ? "solid" : "ghost"}
          as={Link}
          href="/dashboard"
        >
          <Text
            w="100%"
            textAlign="left"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            View All
          </Text>
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
    </Box>
  );
};

export const ShellSidebarDrawer: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        onClick={onOpen}
        size="sm"
        aria-label="drawer"
        variant="ghost"
        icon={<FiMenu />}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p="0" m="0">
            <Sidebar viewingAll={props.viewingAll} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const StreamHead: React.FC = () => {
  const stream = useStream();

  return (
    <Head>
      <title>{stream.name} | MyPress</title>
    </Head>
  );
};

export const StreamShell: React.FC<React.PropsWithChildren<Props>> = (
  props
) => {
  const isMobile = useIsMobile();

  return (
    <Flex h="100vh" overflow="hidden">
      {!isMobile && (
        <Box>
          <Sidebar viewingAll={props.viewingAll} />
        </Box>
      )}
      <Flex w="full" overflow="auto">
        {props.viewingAll && props.children}
        {!props.viewingAll && (
          <StreamProvider>
            <>
              <StreamHead />
              {props.children}
            </>
          </StreamProvider>
        )}
      </Flex>
    </Flex>
  );
};
