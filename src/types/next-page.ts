import type { NextPage } from "next";
import type { ReactElement } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactElement;
};
