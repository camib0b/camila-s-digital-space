import { useQuery } from "@tanstack/react-query";
import { fetchGithubContributions } from "@/lib/githubContributionsApi";

const GITHUB_CONTRIBUTIONS_STALE_TIME_MS = 6 * 60 * 60 * 1000;

export function useGithubContributions() {
  const query = useQuery({
    queryKey: ["github-contributions"],
    queryFn: fetchGithubContributions,
    staleTime: GITHUB_CONTRIBUTIONS_STALE_TIME_MS,
    retry: 1,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.isError,
  };
}
