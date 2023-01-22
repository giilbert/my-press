import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import type {
  Stream,
  StreamPost,
  StreamPostOnUser,
  User,
} from "@prisma/client";
import moment from "moment";
import { trpc } from "../../utils/api";

export const PostCard: React.FC<{
  post: StreamPost & {
    userStatus: StreamPostOnUser[];
    author: User;
    stream: { name: string };
  };
}> = ({ post }) => {
  const trpcContext = trpc.useContext();
  const updateStatus = trpc.post.updateStatus.useMutation();

  const status = post.userStatus[0];
  const isCompleted = status?.completed || false;

  return (
    <Flex
      w="full"
      key={post.id}
      p={4}
      justifyContent="space-between"
      borderBottom="solid 1px"
      borderBottomColor="gray.600"
    >
      <HStack alignItems="center" display="flex">
        <Checkbox
          defaultChecked={isCompleted}
          onChange={(e) => {
            void updateStatus
              .mutateAsync({
                completed: e.target.checked,
                notes: status?.notes || "",
                postId: post.id,
              })
              .then(() => {
                void trpcContext.post.invalidate();
              });
          }}
        />
        <Stack spacing="3rem">
          <Heading fontWeight="medium" fontSize="large">
            {post.title}
          </Heading>
        </Stack>
      </HStack>
      <HStack>
        <Tag>{post.stream.name}</Tag>
        {post.dueDate && (
          <Text color="gray.300">{moment(post.dueDate).format("MMM DD")}</Text>
        )}
        <Avatar
          src={post.author.image || undefined}
          name={post.author.name || undefined}
          size="xs"
        />
      </HStack>
    </Flex>
  );
};
