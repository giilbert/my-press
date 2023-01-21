import { Box, Button, VStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { createLazyForm } from "../components/forms/lazy-form";
import { createStreamSchema } from "../shared/schemas/stream";
import { noop } from "../utils/noop";
import { trpc } from "../utils/trpc";

const { useForm: useTestForm, Form: TestForm } = createLazyForm({
  schema: createStreamSchema,
  render: (Field) => (
    <VStack gap="4" p="4">
      <Field.name.Text label="Name" description="asdasd" />
      <Field.slug.Text label="Slug" />
      <Button w="full" type="submit">
        Submit
      </Button>
    </VStack>
  ),
});

const Home: NextPage = () => {
  const form = useTestForm();
  const router = useRouter();
  const createStream = trpc.stream.create.useMutation();

  return (
    <Box>
      <TestForm
        onSubmit={(data) => {
          createStream
            .mutateAsync(data)
            .then(async () => {
              await router.push(`/stream/${data.slug}`);
            })
            .catch(noop);
        }}
        form={form}
      />
    </Box>
  );
};

export default Home;
