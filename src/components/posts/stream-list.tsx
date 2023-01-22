import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/api";
import { useStream } from "../streams/stream-provider";
import { DefaultQueryCell } from "../utils/default-query-cell";
import { PostCard } from "./post-card";

export const StreamPostList: React.FC = () => {
  const stream = useStream();
  const postsQuery = trpc.post.listOfStream.useQuery({ streamId: stream.id });

  const today = new Date();

  // TODO: infinite query more posts
  return (
    <VStack w="full">
      <DefaultQueryCell
        query={postsQuery}
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
    </VStack>
  );
};
