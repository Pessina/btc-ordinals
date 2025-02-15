import Image from "next/image";

type OrdinalContentProps = {
    id: string;
    number: number;
    content_type: string;
    content_length: number;
    location: string;
}

export const OrdinalContent: React.FC<{ ordinalDetails: OrdinalContentProps }> = ({ ordinalDetails }) => {
    const contentUrl = `https://ordiscan.com/content/${ordinalDetails.id}`;

    // Render safe image types directly.
    // SVGs may include scripts, so we handle them (and other non-standard types) in an isolated iframe.
    if (ordinalDetails.content_type.startsWith('image/') && !ordinalDetails.content_type.startsWith('image/svg')) {
        if (ordinalDetails.content_type === 'image/gif') {
            return (
                <img
                    src={contentUrl}
                    alt={`Ordinal #${ordinalDetails.number}`}
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                />
            );
        }

        return (
            <Image
                src={contentUrl}
                alt={`Ordinal #${ordinalDetails.number}`}
                fill
                className="object-contain rounded-lg"
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
