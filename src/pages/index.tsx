import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { type NextPage } from "next";
import { z } from "zod";
import { createLazyForm } from "../components/forms/lazy-form";

const { useForm: useTestForm, Form: TestForm } = createLazyForm({
  schema: z.object({
    name: z.string().min(5),
    slug: z.string().min(5),
  }),
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

  return (
    <Box>
      <TestForm onSubmit={console.log} form={form} />
    </Box>
  );
};

export default Home;
