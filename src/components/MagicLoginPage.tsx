import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function MagicLoginPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setError("Missing token");
            setLoading(false);
            return;
        }

        async function login() {
            try {
                const res = await axios.post("http://localhost:5000/magic-login/verify", { token });

                localStorage.setItem("token", res.data.token);

                navigate("/");
            } catch (err) {
                setError("Invalid or expired login link.");
            } finally {
                setLoading(false);
            }
        }

        login();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg">
                Logging you in...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-600">
                {error}
            </div>
        );
    }

    return null;
}