"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletOrdinals } from "@/hooks/useWalletOrdinals";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as bitcoin from "bitcoinjs-lib";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const formSchema = z.object({
    address: z.string().min(1, {
        message: "Address is required.",
    }).refine((val) => {
        try {
            // Legacy address
            bitcoin.address.fromBase58Check(val);
            return true;
        } catch (err) {
            try {
                // SegWith and Taproot address
                bitcoin.address.fromBech32(val);
                return true;
            } catch (err) {
                return false;
            }
        }
    }, "Invalid Bitcoin address format")
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
    const [walletAddress, setWalletAddress] = useState<string>("");
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: ""
        }
    });

    const {
        data: ordinalsData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useWalletOrdinals(walletAddress, { limit: 5, offset: 0 });
    const router = useRouter();

    function onSubmit(data: FormValues) {
        setWalletAddress(data.address);
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background text-foreground">
            <div className="w-full max-w-2xl p-8">
                <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Ordinal Inscription Lookup</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Owner Bitcoin Address:</FormLabel>
                                    <FormControl>
                                        {/* TODO: The button should not be inside the FormField, check if it's possible to move it outside */}
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <Input
                                                placeholder="Enter Bitcoin address"
                                                {...field}
                                            />
                                            <Button type="submit" className="bg-button-bg text-white">Look up</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <div className="mt-8 mb-2">Results</div>
                {isLoading && (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 rounded-lg bg-black/20">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {ordinalsData && (
                    <div className="space-y-2">
                        {ordinalsData.pages.map((page) =>
                            page.results.map((utxo) =>
                                utxo.inscriptions.map((inscription) => (
                                    <Link
                                        key={inscription.id}
                                        href={`/${walletAddress}/ordinal/${inscription.id}`}
                                    >
                                        <div className="flex justify-between items-center py-2">
                                            <p>Inscription {inscription.id.slice(0, 8)}</p>
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                ))
                            )
                        )}
                        {hasNextPage && (
                            <div className="flex justify-center my-4">
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    variant="secondary"
                                >
                                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
