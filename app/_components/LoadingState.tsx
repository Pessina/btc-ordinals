import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg bg-black/20">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            ))}
        </div>
    );
};