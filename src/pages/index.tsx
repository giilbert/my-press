import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AllPostList } from "../components/posts/all-list";
import { CreateStream } from "../components/streams/create-stream";
import { trpc } from "../utils/api";

const Home: NextPage = () => {
  const joinedStreamQuery = trpc.stream.getJoinedStreams.useQuery();

  return (
    <Box p="4">
      <Button onClick={() => signIn("google")}>Sign in</Button>
      <CreateStream />

      <Heading mt="2">All the things</Heading>
      <AllPostList />

      <Heading mt="2">Your subscriptions</Heading>
      {joinedStreamQuery.data?.map((stream) => (
        <Link key={stream.id} href={`/stream/${stream.slug}`}>
          <Box border="solid #aaa 1px" mt="2" p="2" borderRadius="sm">
            <Text>HELLO DESIGN ME</Text>
            <Text>Name: {stream.name}</Text>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default Home;
