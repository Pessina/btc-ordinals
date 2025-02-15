import { Label } from "@radix-ui/react-label";
import { Input } from "../../../../../components/ui/input";

export const AttributeItem = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className="flex flex-col text-left gap-2">
            <Label className="text-white/70">{label}</Label>
            <Input disabled className="bg-input-bg disabled:opacity-100" value={value} />
        </div>
    );
};