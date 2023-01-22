import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import { createStreamSchema } from "../../shared/schemas/stream";
import { trpc } from "../../utils/api";
import { noop } from "../../utils/noop";
import { TsForm } from "../forms/ts-form";
import { useStream } from "./stream-provider";

export const DeleteStream: React.FC = () => {
  const router = useRouter();
  const deleteStream = trpc.stream.delete.useMutation();
  const ctx = trpc.useContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const stream = useStream();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Delete Stream</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="medium">
              Are you sure you would like to delete this stream? This action is
              NOT REVERSIBLE, and all data WILL BE LOST.
            </Text>
          </ModalBody>
          <ModalFooter as={HStack}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() =>
                void deleteStream
                  .mutateAsync({ streamId: stream.id })
                  .then(() => void ctx.stream.invalidate())
                  .then(onClose)
                  .then(() => void router.push("/dashboard"))
              }
              colorScheme="red"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button
        onClick={onOpen}
        size="sm"
        leftIcon={<FaTrash />}
        colorScheme="red"
        variant="outline"
      >
        Delete Stream
      </Button>
    </>
  );
};
