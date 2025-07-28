import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:5000/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            setSuccess('Successfully registered!');
            localStorage.setItem('token', data.token);
            console.log('User:', data.user);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
        }
    };

    return (
        <div className="w-full h-screen xl:overflow-hidden flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-[500px] rounded-xl bg-white shadow-2xl p-4 flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-[24px] font-bold mb-4">Sign up</h3>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <div className="mt-4">
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
