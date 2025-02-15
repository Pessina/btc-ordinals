"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrdinalDetails } from "@/hooks/useOrdinalDetails";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrdinalPage() {
    const { id, address } = useParams<{ id: string; address: string }>();
    const router = useRouter();

    const { data: ordinalDetails, isLoading, error } = useOrdinalDetails(
        address,
        id
    );

    if (isLoading) {
        return (
            <div className="container mx-auto p-8">
                <div className="max-w-2xl mx-auto space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-96 w-full" />
                    <div className="space-y-2">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </div>
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
        const contentUrl = `https://ordiscan.com/content/${ordinalDetails.id}`;

        // Render safe image types directly.
        // SVGs may include scripts, so we handle them (and other non-standard types) in an isolated iframe.
        if (ordinalDetails.content_type.startsWith('image/') && !ordinalDetails.content_type.startsWith('image/svg')) {
            if (ordinalDetails.content_type === 'image/gif') {
                return (
                    <img
                        src={contentUrl}
                        alt={`Ordinal #${ordinalDetails.number}`}
                        className="w-full h-full object-contain rounded-lg"
                        loading="lazy"
                    />
                );
            }

            return (
                <Image
                    src={contentUrl}
                    alt={`Ordinal #${ordinalDetails.number}`}
                    fill
                    className="object-contain rounded-lg"
                    unoptimized={false}
                    loading="lazy"
                />
            );
        }


        // Render SVGs or other potentially unsafe content in an isolated iframe.
        // The sandbox (allow-scripts) restricts dangerous operations while permitting scripts in a confined context.
        return (
            <iframe
                src={contentUrl}
                className="w-full h-full"
                sandbox="allow-scripts"
                title="Ordinal HTML content"
                loading="lazy"
                referrerPolicy="no-referrer"
            />
        );
    };


    return (
        <div className="container mx-auto p-8">
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-center mb-4 relative">
                    <Link href="/" className="absolute left-0">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Details</h1>
                </div>

                <div className="relative w-full h-96 mb-6">
                    {renderContent()}
                </div>

                <div className="space-y-2">
                    <p>ID: {ordinalDetails.id}</p>
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
