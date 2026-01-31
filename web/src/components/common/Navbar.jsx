import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DevConnectIcon } from "./DevConnectIcon";

export default function Navbar() {
    const isLoggedIn = false;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {/* <div className="h-9 w-9 rounded-2xl bg-foreground text-background shadow-md shadow-black/40" /> */}
                    <DevConnectIcon />
                    <div className="text-lg font-semibold tracking-tight text-foreground">
                        DevConnect
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <Avatar size="lg">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                            Sign in
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
