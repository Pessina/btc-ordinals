import { ORDISCAN_API_URL } from "@/lib/constants";
import Image from "next/image";
import { InscriptionDetails } from "@/hooks/useInscriptionDetails";

export const OrdinalContent: React.FC<{ ordinalDetails: InscriptionDetails }> = ({ ordinalDetails }) => {
    const contentUrl = `${ORDISCAN_API_URL}/content/${ordinalDetails.id}`;

    // Render safe image types directly.
    // SVGs may include scripts, so we handle them (and other non-standard types) in an isolated iframe.
    if (ordinalDetails.content_type?.startsWith('image/') && !ordinalDetails.content_type?.startsWith('image/svg')) {
        if (ordinalDetails.content_type === 'image/gif') {
            return (
                <img
                    src={contentUrl}
                    alt={`Ordinal #${ordinalDetails.number}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                />
            );
        }

        return (
            <Image
                src={contentUrl}
                alt={`Ordinal #${ordinalDetails.number}`}
                fill
                className="object-contain"
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
