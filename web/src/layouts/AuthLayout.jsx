import { DevConnectIcon } from "@/components/common/DevConnectIcon";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-background">
            <div className="relative mx-auto flex min-h-screen items-center justify-center px-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_50%)]" />
                <div className="relative w-full max-w-lg">
                    <div className="mb-6 flex items-center justify-center gap-4 text-center">
                        <DevConnectIcon />
                        <div>
                            <div className="text-xl font-semibold tracking-tight text-foreground">
                                DevConnect
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Match with developers who build like you.
                            </div>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
