import { XVERSE_API_URL } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

interface OrdinalUTXO {
  txid: string;
  vout: number;
  block_height: number;
  value: number;
  sats: Array<{
    number: string;
    rarity_ranking: string;
    offset: number;
  }>;
  inscriptions: Array<{
    id: string;
    offset: number;
    content_type: string;
  }>;
}

interface PageParam {
  address: string;
  offset: number;
  limit: number;
}

interface FetchResponse {
  limit: number;
  offset: number;
  total: number;
  results: OrdinalUTXO[];
}

const fetchOrdinalUTXOs = async ({ pageParam }: { pageParam: PageParam }) => {
  const response = await fetch(
    `${XVERSE_API_URL}/address/${pageParam.address}/ordinal-utxo?offset=${pageParam.offset}&limit=${pageParam.limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ordinal UTXOs");
  }
  const data = (await response.json()) as FetchResponse;

  return {
    results: data.results,
    total: data.total,
    nextOffset: pageParam.offset + pageParam.limit,
    hasMore: pageParam.offset + pageParam.limit < data.total,
  };
};

export const useWalletOrdinals = (
  address?: string,
  options: { limit: number; offset: number } = { limit: 5, offset: 0 }
) => {
  return useInfiniteQuery({
    queryKey: ["ordinals", address],
    queryFn: ({ pageParam }) =>
      fetchOrdinalUTXOs({
        pageParam: {
          address: address ?? "",
          offset: pageParam?.offset ?? options.offset,
          limit: options.limit,
        },
      }),
    initialPageParam: {
      offset: options.offset,
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? { offset: lastPage.nextOffset } : undefined,
    enabled: !!address,
  });
};
