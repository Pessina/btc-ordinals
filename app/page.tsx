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

const formSchema = z.object({
  address: z.string().refine((val) => {
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const {
    data: ordinalsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useWalletOrdinals(walletAddress, { limit: 5, offset: 0 });
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    setWalletAddress(data.address);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background text-foreground">
      <div className="w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Ordinal Inscription Lookup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Owner Bitcoin Address</label>
            <div className="flex gap-4">
              <Input
                placeholder="Enter wallet address"
                {...register("address")}
                className="flex-1 bg-black/20 border-0"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Look up
              </Button>
            </div>
          </div>
          {errors.address && (
            <p className="text-destructive text-sm">{errors.address.message}</p>
          )}
        </form>

        <div className="text-sm font-medium mb-2">Results</div>

        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/20">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
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
                  <div
                    key={inscription.id}
                    className="p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${walletAddress}/ordinal/${inscription.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-mono text-sm">Inscription {inscription.id}</p>
                        <p className="text-muted-foreground text-sm">{inscription.content_type}</p>
                      </div>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                ))
              )
            )}

            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="secondary"
                  className="bg-black/20 hover:bg-black/30"
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
