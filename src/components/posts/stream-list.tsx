import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { trpc } from "../../utils/api";
import { useStream } from "../streams/stream-provider";
import { PostCard } from "./post-card";

export const StreamPostList: React.FC = () => {
  const stream = useStream();
  const postsQuery = trpc.post.listOfStream.useInfiniteQuery(
    {
      streamId: stream.id,
    },
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
