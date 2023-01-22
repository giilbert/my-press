import Head from "next/head";

export const Title: React.FC<{ title: string }> = ({ title }) => (
  <Head>
    <title>MyPress | {title}</title>
  </Head>
);
