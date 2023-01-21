import { Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createStreamSchema } from "../../shared/schemas/stream";
import { noop } from "../../utils/noop";
import { trpc } from "../../utils/trpc";
import { TsForm } from "../forms/ts-form";

export const CreateStream: React.FC = () => {
  const router = useRouter();
  const createStream = trpc.stream.create.useMutation();

  return (
    <VStack gap="2" w="full" alignItems="flex-start">
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
            .catch(noop);
        }}
        schema={createStreamSchema}
        renderAfter={() => (
          <Button type="submit" isLoading={createStream.isLoading} mt="4">
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
  );
};
