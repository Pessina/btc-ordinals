import { useQuery } from "@tanstack/react-query";

interface OrdinalUTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
  inscriptions: Array<{
    id: string;
    number: number;
    content_type: string;
  }>;
}

interface InscriptionDetails {
  id: string;
  number: number;
  address: string;
  content_type: string;
  content_length: number;
  genesis_fee: number;
  genesis_height: number;
  genesis_transaction: string;
  location: string;
  offset: string;
  output: string;
  timestamp: string;
}

const fetchOrdinalUTXOs = async (
  address: string,
  offset?: number,
  limit: number = 20
) => {
  const response = await fetch(
    `https://api-3.xverse.app/v1/address/${address}/ordinal-utxo?offset=${
      offset || 0
    }&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch ordinal UTXOs");
  }
  return response.json() as Promise<{ results: OrdinalUTXO[]; total: number }>;
};

const fetchInscriptionDetails = async (
  address: string,
  inscriptionId: string
) => {
  const response = await fetch(
    `https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${inscriptionId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch inscription details");
  }
  return response.json() as Promise<InscriptionDetails>;
};

export const useWalletOrdinals = (
  address?: string,
  offset?: number,
  limit?: number
) => {
  return useQuery({
    queryKey: ["ordinals", address, offset, limit],
    queryFn: () => (address ? fetchOrdinalUTXOs(address, offset, limit) : null),
    enabled: !!address,
  });
};

export const useInscriptionDetails = (
  address?: string,
  inscriptionId?: string
) => {
  return useQuery({
    queryKey: ["inscription", address, inscriptionId],
    queryFn: () =>
      address && inscriptionId
        ? fetchInscriptionDetails(address, inscriptionId)
        : null,
    enabled: !!address && !!inscriptionId,
  });
};
