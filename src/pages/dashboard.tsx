import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { PostCard } from "../components/posts/post-card";
import { StreamHeading } from "../components/streams/stream-heading";
import {
  ShellSidebarDrawer,
  StreamShell,
} from "../components/streams/stream-shell";
import { DefaultQueryCell } from "../components/utils/default-query-cell";
import { Title } from "../components/utils/title";
import type { CustomNextPage } from "../types/next-page";
import { trpc } from "../utils/api";
import { useIsMobile } from "../utils/use-is-mobile";

const Dashboard: CustomNextPage = () => {
  const allIssues = trpc.post.listAll.useQuery();
  const isMobile = useIsMobile();

  const today = new Date();

  return (
    <Stack w="full">
      <Title title="Home" />
      <Flex
        p={4}
        w="full"
        borderBottom="solid 1px"
        borderBottomColor="gray.600"
        alignItems="center"
        gap="2"
      >
        {isMobile && <ShellSidebarDrawer />}
        <Heading fontWeight="semibold" fontSize="large">
          All Todos
        </Heading>
      </Flex>
      <DefaultQueryCell
        query={allIssues}
        success={({ data }) => (
          <>
            <Flex
              w="full"
              p={4}
              justifyContent="space-between"
              borderBottom="solid 1px"
              borderBottomColor="gray.600"
            >
              <Text>To Do</Text>
            </Flex>
            {data
              .filter(
                (d) =>
                  (!d.dueDate && !d.userStatus[0]?.completed) ||
                  (d.dueDate &&
                    d.dueDate > today &&
                    !d.userStatus[0]?.completed)
              )
              .map(
                (
                  d // To Do
                ) => (
                  <PostCard post={d} key={d.id} />
                )
              )}
            <Flex
              w="full"
              p={4}
              justifyContent="space-between"
              borderBottom="solid 1px"
              borderBottomColor="gray.600"
            >
              <Text>Done</Text>
            </Flex>
            {data
              .filter((d) => d.userStatus[0]?.completed)
              .map(
                (
                  d // Done
                ) => (
                  <PostCard post={d} key={d.id} />
                )
              )}
            <Flex
              w="full"
              p={4}
              justifyContent="space-between"
              borderBottom="solid 1px"
              borderBottomColor="gray.600"
            >
              <Text>Missing</Text>
            </Flex>
            {data
              .filter(
                (d) =>
                  d.dueDate && d.dueDate < today && !d.userStatus[0]?.completed
              )
              .map(
                (
                  d // Missing
                ) => (
                  <PostCard post={d} key={d.id} />
                )
              )}
          </>
        )}
      />
    </Stack>
  );
};

Dashboard.auth = true;

Dashboard.getLayout = (page) => <StreamShell viewingAll>{page}</StreamShell>;

export default Dashboard;
