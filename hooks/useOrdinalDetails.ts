import { useQuery } from "@tanstack/react-query";

interface InscriptionDetails {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: number;
  genesis_timestamp: number;
  location: string;
  output: string;
  offset: number;
  sat_ordinal: number;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  tx_id: string;
  timestamp: number;
  value: number;
  category: string | null;
  collection_id?: string;
  collection_name?: string;
  inscription_floor_price?: number;
}

type FetchInscriptionDetailsParams = {
  address: string;
  inscriptionId: string;
};

const fetchInscriptionDetails = async ({
  address,
  inscriptionId,
}: FetchInscriptionDetailsParams): Promise<InscriptionDetails> => {
  const response = await fetch(
    `https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${inscriptionId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch inscription details: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export const useOrdinalDetails = (address?: string, inscriptionId?: string) => {
  return useQuery({
    queryKey: ["ordinal-details", address, inscriptionId],
    queryFn: () =>
      address && inscriptionId
        ? fetchInscriptionDetails({ address, inscriptionId })
        : Promise.reject(new Error("Address and inscription ID are required")),
    enabled: Boolean(address) && Boolean(inscriptionId),
  });
};
