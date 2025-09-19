"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  // Asegura una sola instancia por montaje
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* opcional en dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
