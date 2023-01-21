import { Box, Button, Heading, Text } from "@chakra-ui/react";
import type { StreamPost, StreamPostOnUser } from "@prisma/client";
import { trpc } from "../../utils/api";

export const PostCard: React.FC<{
  post: StreamPost & {
    userStatus: StreamPostOnUser[];
  };
}> = ({ post }) => {
  const trpcContext = trpc.useContext();
  const updateStatus = trpc.post.updateStatus.useMutation();

  const status = post.userStatus[0];
  const isCompleted = status?.completed || false;

  return (
    <Box
      border="solid #aaa 1px"
      mt="2"
      p="4"
      w="full"
      borderRadius="sm"
      key={post.id}
    >
      {isCompleted ? (
        <>
          <Text>DOne!!!</Text>
          <Button
            onClick={() => {
              updateStatus
                .mutateAsync({
                  completed: false,
                  notes: status?.notes || "",
                  postId: post.id,
                })
                .then(() => {
                  trpcContext.post.invalidate();
                });
            }}
            isLoading={updateStatus.isLoading}
          >
            Mark as not done
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            updateStatus
              .mutateAsync({
                completed: true,
                notes: status?.notes || "",
                postId: post.id,
              })
              .then(() => {
                trpcContext.post.invalidate();
              });
          }}
          isLoading={updateStatus.isLoading}
        >
          Mark as done
        </Button>
      )}
      <Heading fontSize="xl">{post.title}</Heading>
      <Text fontSize="md">{post.content}</Text>
    </Box>
  );
};
