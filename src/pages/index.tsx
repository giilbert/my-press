import { Text, Center, Heading, Stack, Button } from "@chakra-ui/react";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <Center h="100vh">
      <Stack spacing={2}>
        <Heading fontWeight="semibold" fontSize="xx-large">
          MyPress
        </Heading>
        <Text fontWeight="medium" fontSize="large">
          The information that matters to you. All in one place.
        </Text>

        {session.status === "unauthenticated" && (
          <Button
            leftIcon={<FaGoogle />}
            onClick={() => {
              void signIn("google", { callbackUrl: "/dashboard" });
            }}
          >
            Continue with Google
          </Button>
        )}

        {session.status === "authenticated" && (
          <Button as={Link} href="/dashboard">
            Go to Dashboard
          </Button>
        )}
      </Stack>
    </Center>
  );
};

export default Home;
