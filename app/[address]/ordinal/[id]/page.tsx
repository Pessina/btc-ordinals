"use client";

import { useParams } from "next/navigation";
import { useOrdinalDetails } from "@/hooks/useOrdinalDetails";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { AttributeItem } from "@/app/[address]/ordinal/[id]/_components/AttributeItem";
import { truncateText } from "@/lib/utils";
import { OrdinalContent } from "./_components/OrdinalContent";
import { LoadingState } from "./_components/LoadingState";

export default function OrdinalPage() {
    const { id, address } = useParams<{ id: string; address: string }>();

    const { data: ordinalDetails, isLoading, error } = useOrdinalDetails(
        address,
        id
    );

    if (isLoading) return <LoadingState />;

    if (error || !ordinalDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">Error loading ordinal</p>
            </div>
        );
    }

    return (
        <div className="mx-auto md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-3 items-center py-4">
                    <Link href={`/${address}`} className="justify-self-start">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold justify-self-center">Details</h1>
                </div>

                <div className="relative w-full aspect-square mb-6">
                    <OrdinalContent ordinalDetails={ordinalDetails} />
                </div>

                <div>
                    <h2 className="text-xl">Inscription: {ordinalDetails.number}</h2 >

                    <Separator className="my-4" />

                    <div className="">
                        <div className="space-y-2">
                            <Label className="text-white/70">Inscription ID</Label>
                            <p className="break-all">{ordinalDetails.id}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/70">Owner Address</Label>
                            <p className="break-all">{address}</p>
                        </div>
                    </div>

                    <h3 className="text-lg my-4">Attributes</h3>
                    <div className="flex flex-col gap-4 text-sm">
                        <AttributeItem label="Output Value" value={ordinalDetails.output} />
                        <AttributeItem label="Content Type" value={ordinalDetails.content_type} />
                        <AttributeItem label="Content Length" value={ordinalDetails.content_length.toString() + "bytes"} />
                        <AttributeItem label="Location" value={truncateText(ordinalDetails.location)} />
                        <AttributeItem label="Genesis Transaction ID" value={truncateText(ordinalDetails.genesis_tx_id)} />
                        <AttributeItem label="Genesis Fee" value={ordinalDetails.genesis_fee.toString()} />
                        <AttributeItem label="Genesis Block Height" value={ordinalDetails.genesis_block_height.toString()} />
                        <AttributeItem label="Genesis Address" value={truncateText(ordinalDetails.genesis_address)} />
                        <AttributeItem label="Offset" value={ordinalDetails.offset.toString()} />
                        <AttributeItem label="Sat Ordinal" value={ordinalDetails.sat_ordinal.toString()} />
                        <AttributeItem label="Sat Rarity" value={ordinalDetails.sat_rarity} />
                        <AttributeItem label="Timestamp" value={new Date(ordinalDetails.timestamp * 1000).toLocaleString()} />
                        {ordinalDetails.collection_name && (
                            <AttributeItem label="Collection" value={ordinalDetails.collection_name} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
