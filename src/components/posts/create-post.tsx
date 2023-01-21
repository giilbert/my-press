import { Box, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { createPostSchema } from "../../shared/schemas/post";
import { noop } from "../../utils/noop";
import { trpc } from "../../utils/trpc";
import { TsForm } from "../forms/ts-form";
import { useStream } from "../streams/stream-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const CreatePost: React.FC = () => {
  const stream = useStream();
  const createPost = trpc.post.create.useMutation();
  const [, forceRender] = useState<number>();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    reValidateMode: "onBlur",
  });

  return (
    <Box>
      <TsForm
        schema={createPostSchema}
        form={form}
        props={{
          content: { label: "Content", autoComplete: "off" },
          title: { label: "Title", autoComplete: "off" },
        }}
        onSubmit={(data) => {
          createPost
            .mutateAsync({
              streamId: stream.id,
              ...data,
            })
            .then(() => {
              console.log(form);
              forceRender(0);
              form.reset();
            })
            .catch(noop);
        }}
        renderAfter={() => <Button type="submit">Submit</Button>}
      />
    </Box>
  );
};
