import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createStreamSchema } from "../../shared/schemas/stream";
import { noop } from "../../utils/noop";
import { trpc } from "../../utils/api";
import { TsForm } from "../forms/ts-form";

export const CreateStream: React.FC = () => {
  const router = useRouter();
  const createStream = trpc.stream.create.useMutation();
  const ctx = trpc.useContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Stream</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap="2" w="full" alignItems="flex-start" mb="4">
              <TsForm
                formProps={{
                  style: {
                    width: "100%",
                  },
                }}
                onSubmit={(data) => {
                  createStream
                    .mutateAsync(data)
                    .then(async () => {
                      await router.push(`/stream/${data.slug}`);
                    })
                    .then(() => {
                      void ctx.stream.getJoinedStreams.invalidate();
                    })
                    .then(onClose)
                    .catch(noop);
                }}
                schema={createStreamSchema}
                renderAfter={() => (
                  <Button
                    type="submit"
                    isLoading={createStream.isLoading}
                    mt="4"
                  >
                    Submit
                  </Button>
                )}
                props={{
                  name: { label: "Name" },
                  slug: { label: "Slug" },
                }}
              />

              <Text color="red.400">{createStream.error?.message}</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button onClick={onOpen} size="sm">
        Create Stream
      </Button>
    </>
  );
};
