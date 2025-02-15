"use client";

import { useParams } from "next/navigation";
import { useOrdinalDetails } from "@/hooks/useOrdinalDetails";

export default function OrdinalPage() {
    const { id, address } = useParams();

    // TODO: validate
    const { data: ordinalDetails, isLoading, error } = useOrdinalDetails(address as string, id as string);

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

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg space-y-4">
                <h1 className="text-2xl font-bold">Ordinal #{ordinalDetails.number}</h1>

                <div className="space-y-2">
                    <p className="font-mono text-sm">ID: {ordinalDetails.id}</p>
                    <p>Address: {ordinalDetails.address}</p>
                    <p>Content Type: {ordinalDetails.content_type}</p>
                    <p>Content Length: {ordinalDetails.content_length}</p>
                    <p>Genesis Fee: {ordinalDetails.genesis_fee}</p>
                    <p>Genesis Height: {ordinalDetails.genesis_height}</p>
                    <p>Genesis Transaction: {ordinalDetails.genesis_transaction}</p>
                    <p>Location: {ordinalDetails.location}</p>
                    <p>Offset: {ordinalDetails.offset}</p>
                    <p>Output: {ordinalDetails.output}</p>
                    <p>Timestamp: {ordinalDetails.timestamp}</p>
                </div>
            </div>
        </div>
    );
}
