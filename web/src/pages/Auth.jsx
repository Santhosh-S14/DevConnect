import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState } from "react"

export default function Auth() {

    const API_base_url = "http://localhost:3000"
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleLogin = async (email, password) => {
        const loginUrl = `${API_base_url}/api/v1/auth/login`
        try {
            const res = await axios.post(loginUrl, {
                email, password
            }, { withCredentials: true });

            if (res.status === 200 && res.data) {
                console.log("Login Successful", res?.data?.userObj);
            }
            else {
                console.log("Login Failed", res?.status, res?.data);
            }
        }
        catch (error) {
            const status = error?.response?.status;
            const data = error?.response?.data;
            console.log("Login Error", status, data ?? error?.message);
        }
    }

    return (
        <>
            <Card className="w-full max-w-lg rounded-2xl border-border/60 bg-card/90 shadow-xl shadow-black/40 backdrop-blur">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-semibold tracking-tight">Login</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Continue building your developer network.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="me@example.com"
                                    className="bg-background/40"
                                    required
                                    onChange={
                                        (e) => setEmail(e.target.value)
                                    }
                                    value={email}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required
                                    className="bg-background/40"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => handleLogin(email, password)}
                    >
                        Login
                    </Button>

                </CardFooter>
            </Card>
        </>
    )
}
