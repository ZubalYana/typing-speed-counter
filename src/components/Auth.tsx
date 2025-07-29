import { useState } from "react";
import {
    TextField,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [isRegister, setIsRegister] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const isStrongPassword = (password: string): boolean => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const endpoint = isRegister ? 'signUp' : 'login';
        const payload = isRegister ? { name, email, password } : { email, password };

        if (isRegister && !isStrongPassword(password)) {
            setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            return
        }

        try {
            const res = await fetch(`http://localhost:5000/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || `${isRegister ? 'Registration' : 'Login'} failed`);
                return;
            }

            setSuccess(`${isRegister ? 'Registered' : 'Logged in'} successfully!`);
            localStorage.setItem('token', data.token);
            console.log('User:', data.user);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    return (
        <div className="w-full h-screen xl:overflow-hidden flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-[500px] rounded-xl bg-white shadow-2xl p-4 flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-[24px] font-bold mb-4">
                        {isRegister ? 'Sign up' : 'Log in'}
                    </h3>

                    {isRegister && (
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    )}

                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                </div>

                <div className="flex flex-col gap-2">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isRegister ? 'Register' : 'Log in'}
                    </Button>

                    <p className="text-sm text-center mt-2">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <span
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-blue-500 cursor-pointer ml-1 hover:underline"
                        >
                            {isRegister ? 'Log in' : 'Register'}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
}
