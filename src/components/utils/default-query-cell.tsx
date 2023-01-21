import type { TRPCClientErrorLike } from "@trpc/client";
import NextError from "next/error";
import type { AppRouter } from "../../server/api/root";
import { createQueryCell } from "./query-cell";

const Loading = () => (
  <div>
    <em>Loading...</em>
  </div>
);
type TError = TRPCClientErrorLike<AppRouter>;
export const DefaultQueryCell = createQueryCell<TError>({
  error: (result) => (
    <NextError
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      title={result.error.message}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      statusCode={result.error.data?.httpStatus ?? 500}
    />
  ),
  loading: () => <Loading />,
});
