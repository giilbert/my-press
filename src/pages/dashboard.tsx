import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { PostCard } from "../components/posts/post-card";
import { StreamShell } from "../components/streams/stream-shell";
import { DefaultQueryCell } from "../components/utils/default-query-cell";
import { Title } from "../components/utils/title";
import type { CustomNextPage } from "../types/next-page";
import { trpc } from "../utils/api";

const Dashboard: CustomNextPage = () => {
  const allIssues = trpc.post.listAll.useQuery();

  return (
    <Stack w="full">
      <Title title="Home" />
      <Flex
        p={4}
        w="full"
        bgColor="gray.900"
        borderBottom="solid 1px"
        borderBottomColor="gray.600"
      >
        <Heading fontWeight="semibold" fontSize="large">
          All Items
        </Heading>
      </Flex>
      <DefaultQueryCell
        query={allIssues}
        success={({ data }) => (
          <>
            {data.map((d) => (
              <PostCard post={d} key={d.id} />
            ))}
          </>
        )}
      />
    </Stack>
  );
};

Dashboard.auth = true;

Dashboard.getLayout = (page) => <StreamShell viewingAll>{page}</StreamShell>;

export default Dashboard;
