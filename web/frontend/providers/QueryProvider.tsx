import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Props } from "../../@types/react";

const queryClient = new QueryClient();

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
