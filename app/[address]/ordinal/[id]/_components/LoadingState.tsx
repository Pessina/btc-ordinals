import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
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
};