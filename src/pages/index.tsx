import { Box, Card, CardBody, CardHeader, Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import Link from "next/link";
import { CreateStream } from "../components/streams/create-stream";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const joinedStreamQuery = trpc.stream.getJoinedStreams.useQuery();

  return (
    <Box p="4">
      <CreateStream />
      {joinedStreamQuery.data?.map((stream) => (
        <Link key={stream.id} href={`/stream/${stream.slug}`}>
          <Box border="solid #aaa 1px" mt="2" p="2" borderRadius="md">
            <Text>HELLO DESIGN ME</Text>
            <Text>Name: {stream.name}</Text>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default Home;
