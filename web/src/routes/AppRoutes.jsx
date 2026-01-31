import AuthLayout from "@/layouts/AuthLayout";
import Body from "@/layouts/Body";
import Auth from "@/pages/Auth";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/auth" element={<Auth />} />
            </Route>
            <Route element={<Body />}>
            </Route>
            <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
    )
}