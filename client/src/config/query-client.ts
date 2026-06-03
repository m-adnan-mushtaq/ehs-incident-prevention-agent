import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 300_000, // 5min
      gcTime: 600_000, //10min
    },
  },
});
export default queryClient;
