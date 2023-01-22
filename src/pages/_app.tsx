import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import { trpc } from "../utils/api";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Auth } from "../components/utils/auth";
import type { CustomNextPage } from "../types/next-page";
import { useEffect } from "react";

type CustomComponent = {
  Component: CustomNextPage;
};

type CustomAppProps = AppProps & CustomComponent;

const AppInner = ({
  Component,
  ...props
}: CustomComponent & { children: React.PropsWithChildren["children"] }) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  if (Component.auth) {
    return <Auth>{getLayout(<>{props.children}</>)}</Auth>;
  }

  return getLayout(<>{props.children}</>);
};

export const theme = extendTheme({
  initialColorMode: "dark",
});

const MyApp = ({ Component, pageProps: { ...pageProps } }: CustomAppProps) => {
  useEffect(() => {
    localStorage.setItem("chakra-ui-color-mode", "dark");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider>
        <AppInner Component={Component}>
          <Component {...pageProps} />
        </AppInner>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(MyApp);
