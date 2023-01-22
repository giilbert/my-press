import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";
import { CreatePost } from "../../components/posts/create-post";
import { StreamPostList } from "../../components/posts/stream-list";
import { DeleteStream } from "../../components/streams/delete-stream";
import { useStream } from "../../components/streams/stream-provider";
import {
  ShellSidebarDrawer,
  StreamShell,
} from "../../components/streams/stream-shell";
import { Title } from "../../components/utils/title";
import type { CustomNextPage } from "../../types/next-page";
import { trpc } from "../../utils/api";
import { noop } from "../../utils/noop";
import { useIsMobile } from "../../utils/use-is-mobile";

const StreamPage: CustomNextPage = () => {
  const subscribeToStream = trpc.stream.subscribe.useMutation();
  const unsubcribe = trpc.stream.unsubscribe.useMutation();
  const router = useRouter();
  const stream = useStream();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();
  const ctx = trpc.useContext();

  if (stream.permission) {
    return (
      <Box w="full">
        <Title title={stream.name} />

        <Flex
          p={4}
          w="full"
          borderBottom="solid 1px"
          borderBottomColor="gray.600"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing="2">
            {isMobile && <ShellSidebarDrawer />}

            <Heading fontWeight="semibold" fontSize="large">
              {stream.name}
            </Heading>
          </HStack>
          {stream.permission === "MEMBER" && (
            <Button
              size="sm"
              onClick={() =>
                void unsubcribe
                  .mutateAsync({ streamId: stream.id })
                  .then(() => ctx.stream.invalidate())
                  .catch(noop)
              }
            >
              Unsubscribe
            </Button>
          )}
          {stream.permission !== "MEMBER" && (
            <HStack>
              <DeleteStream />
              <Button size="sm" onClick={onOpen} leftIcon={<FaPlus />}>
                Create Post
              </Button>
            </HStack>
          )}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CreatePost onClose={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
        <StreamPostList />
      </Box>
    );
  }

  return (
    <Box>
      <Text>Subscribe to this stream to view the posts.</Text>

      <Button
        onClick={() => {
          subscribeToStream
            .mutateAsync({
              slug: stream.slug,
            })
            .then(() => {
              router.reload();
            })
            .catch(noop);
        }}
      >
        Subscribe
      </Button>
    </Box>
  );
};

StreamPage.auth = true;

StreamPage.getLayout = (page) => <StreamShell>{page}</StreamShell>;

export default StreamPage;
