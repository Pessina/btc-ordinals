import { useQuery } from "@tanstack/react-query";

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

export const useOrdinalDetails = (address?: string, inscriptionId?: string) => {
  return useQuery({
    queryKey: ["ordinal-details", address, inscriptionId],
    queryFn: () =>
      address && inscriptionId
        ? fetchInscriptionDetails(address, inscriptionId)
        : null,
    enabled: !!address && !!inscriptionId,
  });
};
