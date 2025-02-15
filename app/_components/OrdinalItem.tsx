import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Inscription = {
    id: string;
}

type OrdinalItemProps = {
    inscription: Inscription;
    walletAddress: string;
}

export const OrdinalItem: React.FC<OrdinalItemProps> = ({ inscription, walletAddress }) => {
    return (
        <Link
            key={inscription.id}
            href={`/${walletAddress}/ordinal/${inscription.id}`}
        >
            <div className="flex justify-between items-center py-2">
                <p>Inscription {inscription.id.slice(0, 8)}</p>
                <ChevronRight className="w-5 h-5" />
            </div>
        </Link>
    );
};