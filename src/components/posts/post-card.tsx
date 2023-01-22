import {
  Avatar,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import type { StreamPost, StreamPostOnUser, User } from "@prisma/client";
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
      bg={isCompleted ? "blackAlpha.400" : "unset"}
    >
      <HStack alignItems="center" display="flex">
        <Checkbox
          defaultChecked={isCompleted}
          ml="2"
          mr="4"
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
        <Stack>
          <Heading
            fontWeight="medium"
            fontSize="xl"
            textDecoration={isCompleted ? "line-through" : "unset"}
          >
            {post.title}
          </Heading>
          <Text>{post.content}</Text>
        </Stack>
      </HStack>
      <HStack>
        <Tag>{post.stream.name}</Tag>
        {post.dueDate && (
          <Text color="gray.400">
            {moment(post.dueDate).format("MM/DD/YYYY")}
          </Text>
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
