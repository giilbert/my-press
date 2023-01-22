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
  colors: {
    gray: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },
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
