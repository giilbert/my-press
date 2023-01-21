import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/api";
import { PostCard } from "./post-card";

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
        <PostCard key={post.id} post={post} />
      ))}
    </VStack>
  );
};
