"use client";

import { useParams } from "next/navigation";
import { useOrdinalDetails } from "@/hooks/useOrdinalDetails";
import Image from "next/image";

export default function OrdinalPage() {
    const { id, address } = useParams();

    const { data: ordinalDetails, isLoading, error } = useOrdinalDetails(
        address as string,
        id as string
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error loading ordinal details</p>
            </div>
        );
    }

    if (!ordinalDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>No ordinal found</p>
            </div>
        );
    }

    const renderContent = () => {
        const contentUrl = `https://ord.xverse.app/content/${ordinalDetails.id}`;

        if (ordinalDetails.content_type.startsWith('image/')) {
            return (
                <div className="relative w-full h-96 mb-6">
                    <Image
                        src={contentUrl}
                        alt={`Ordinal #${ordinalDetails.number}`}
                        fill
                        className="object-contain rounded-lg"
                    />
                </div>
            );
        }

        if (ordinalDetails.content_type === 'text/plain' || ordinalDetails.content_type === 'application/json') {
            return (
                <iframe
                    src={contentUrl}
                    className="w-full h-96 mb-6 bg-black/20 rounded-lg"
                    title="Ordinal content"
                />
            );
        }

        return (
            <p className="mb-6">
                Content type {ordinalDetails.content_type} - View at:{' '}
                <a
                    href={contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                >
                    {contentUrl}
                </a>
            </p>
        );
    };

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg space-y-4">
                <h1 className="text-2xl font-bold">Ordinal #{ordinalDetails.number}</h1>

                {renderContent()}

                <div className="space-y-2">
                    <p className="font-mono text-sm">ID: {ordinalDetails.id}</p>
                    <p>Address: {ordinalDetails.address}</p>
                    <p>Content Type: {ordinalDetails.content_type}</p>
                    <p>Content Length: {ordinalDetails.content_length}</p>
                    <p>Genesis Fee: {ordinalDetails.genesis_fee}</p>
                    <p>Genesis Block Height: {ordinalDetails.genesis_block_height}</p>
                    <p>Genesis Transaction ID: {ordinalDetails.genesis_tx_id}</p>
                    <p>Genesis Address: {ordinalDetails.genesis_address}</p>
                    <p>Location: {ordinalDetails.location}</p>
                    <p>Offset: {ordinalDetails.offset}</p>
                    <p>Output: {ordinalDetails.output}</p>
                    <p>Sat Ordinal: {ordinalDetails.sat_ordinal}</p>
                    <p>Sat Rarity: {ordinalDetails.sat_rarity}</p>
                    <p>Timestamp: {new Date(ordinalDetails.timestamp * 1000).toLocaleString()}</p>
                    {ordinalDetails.collection_name && (
                        <p>Collection: {ordinalDetails.collection_name}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
