"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletOrdinals } from "@/hooks/useWalletOrdinals";
import { useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { OrdinalItem } from "./components/OrdinalItem";
import { LoadingState } from "./components/LoadingState";
import { useParams } from "next/navigation";

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

/*
TODO:
- Use i18n for text
- Persist Home page state when navigate back from Details page
*/

export default function SearchPage() {
    const params = useParams<{ address: string }>();
    const [walletAddress, setWalletAddress] = useState<string>(params.address || "");
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: params.address || ""
        }
    });

    const {
        data: ordinalsData,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useWalletOrdinals(walletAddress, { limit: 5, offset: 0 });

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
                {isLoading && <LoadingState />}
                {ordinalsData && (
                    <div className="space-y-2">
                        {ordinalsData.pages.map((page) =>
                            page.results.map((utxo) =>
                                utxo.inscriptions.map((inscription) => (
                                    <OrdinalItem key={inscription.id} inscription={inscription} walletAddress={walletAddress} />
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
