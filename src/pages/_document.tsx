import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dark">
      <Head />
      <body>
        <ColorModeScript initialColorMode={"dark"} nonce={"true"} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
