import { getAll } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export function useFetch<T = any>(
  endpoint: string,
  params: Record<string, any> = {}
) {
  return useQuery<T>({
    queryKey: [endpoint, params],
    queryFn: () => getAll(endpoint, params),
    staleTime: 60 * 1000 * 10, // 10 minutes
  });
}
