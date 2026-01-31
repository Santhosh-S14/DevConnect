import { Code, Heart } from "lucide-react";

export function DevConnectIcon() {
    return (
        <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border">
            <Code className="h-6 w-6" />
            <Heart className="absolute -right-1 -top-1 h-4 w-4" color="red" />
        </div>
    );
}
