import { Box, Button, Heading, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { type z } from "zod";
import { createPostSchema } from "../../shared/schemas/post";
import { noop } from "../../utils/noop";
import { trpc } from "../../utils/api";
import { TsForm } from "../forms/ts-form";
import { useStream } from "../streams/stream-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const stream = useStream();
  const createPost = trpc.post.create.useMutation();
  const trpcContext = trpc.useContext();
  const [, forceRender] = useState<number>();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    reValidateMode: "onBlur",
  });

  return (
    <Box mb="4">
      <TsForm
        schema={createPostSchema}
        form={form}
        props={{
          content: { label: "Content", autoComplete: "off" },
          title: { label: "Title", autoComplete: "off" },
          dueDate: {
            label: "Due Date",
          },
        }}
        onSubmit={(data) => {
          createPost
            .mutateAsync({
              streamId: stream.id,
              ...data,
            })
            .then(async () => {
              form.reset();
              form.resetField("dueDate");
              forceRender(0);
              await trpcContext.post.listOfStream.invalidate();
            })
            .then(onClose)
            .catch(noop);
        }}
        renderAfter={() => (
          <Flex w="100%" justifyContent="flex-end">
            <Button
              type="submit"
              isLoading={createPost.isLoading}
              mt="1.5rem"
              ml="auto !important"
            >
              Submit
            </Button>
          </Flex>
        )}
      />
    </Box>
  );
};
