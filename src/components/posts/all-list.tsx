import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/api";

export const AllPostList: React.FC = () => {
  const postsQuery = trpc.post.listAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (curr) => curr.nextCursor,
    }
  );
  const posts = postsQuery.data?.pages.map((page) => page.posts).flat();

  // TODO: infinite query more posts
  return (
    <VStack w="full">
      {posts?.map((post) => (
        <Box
          border="solid #aaa 1px"
          mt="2"
          p="4"
          w="full"
          borderRadius="sm"
          key={post.id}
        >
          <Heading fontSize="xl">{post.title}</Heading>
          <Text fontSize="md">{post.content}</Text>
        </Box>
      ))}
    </VStack>
  );
};
