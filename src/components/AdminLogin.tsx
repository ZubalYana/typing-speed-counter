import { useState } from "react";
import {
    TextField,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import useAlertStore from "../stores/useAlertStore";
import axios from 'axios'

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { showAlert } = useAlertStore();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        axios.post('http://localhost:5000/admin-login', { email, password })
            .then(res => {
                localStorage.setItem('adminToken', res.data.token);
                navigate('/admin');
            })
            .catch(err => {
                setError('Invalid login or unauthorized');
                showAlert('Invalid login or unauthorized', err);
            });
    }

    return (
        <div className="w-full h-screen xl:overflow-hidden flex justify-center items-center">
            <form
                className="w-[500px] rounded-xl bg-white shadow-2xl p-6 flex flex-col justify-between"
                onSubmit={onSubmit}
            >
                <h3 className="text-[24px] font-bold mb-4">
                    Admin Log In
                </h3>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                        if (success) setSuccess('');
                    }}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        marginTop: '20px',
                        backgroundColor: '#10B981'
                    }}
                >
                    Log in
                </Button>
            </form>
        </div>
    )
}
