import { useSession } from "next-auth/react";
import React from "react";

export const Auth: React.FC<React.PropsWithChildren> = (props) => {
  const { status } = useSession({ required: true });

  if (status === "loading") return <p>Loading...</p>;
  return <>{props.children}</>;
};
