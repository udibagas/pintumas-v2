'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const client = new QueryClient();

export default function RegulationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
