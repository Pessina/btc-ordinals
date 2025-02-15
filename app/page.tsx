"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletOrdinals } from "@/hooks/useWalletOrdinals";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormValues = {
  address: string;
};

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { register, handleSubmit } = useForm<FormValues>();
  const { data: ordinalsData, isLoading } = useWalletOrdinals(walletAddress);
  const router = useRouter();

  const onSubmit = (data: FormValues) => {
    setWalletAddress(data.address);
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-8 gap-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Bitcoin Ordinals Viewer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-8">
          <Input
            placeholder="Enter wallet address"
            {...register("address", { required: true })}
            className="flex-1"
          />
          <Button type="submit">View Ordinals</Button>
        </form>
      </div>

      {isLoading && <div>Loading...</div>}

      {ordinalsData && (
        <div className="w-full max-w-2xl space-y-4">
          {ordinalsData.results.map((utxo) =>
            utxo.inscriptions.map((inscription) => (
              <div
                key={inscription.id}
                className="p-4 border rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => router.push(`/${walletAddress}/ordinal/${inscription.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm">ID: {inscription.id}</p>
                    <p>Number: {inscription.number}</p>
                    <p>Type: {inscription.content_type}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
