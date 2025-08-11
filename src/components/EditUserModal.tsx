import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useAlertStore from '../stores/useAlertStore';
import axios from 'axios';
import { Button } from '@mui/material';
type EditUserModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    user: any;
    onSave: () => void;
};

export default function EditUserModal({ isOpen, onRequestClose, user, onSave }: EditUserModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const { showAlert } = useAlertStore();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsVerified(user.isVerified);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/users/${user._id}`, {
                name,
                email,
                isVerified,
            });
            showAlert('User updated successfully', 'success');
            onSave();
            onRequestClose();
        } catch (err) {
            showAlert('Failed to update user', 'error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onRequestClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                                onClick={onRequestClose}
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-1 p-2 border rounded"
                                />
                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isVerified}
                                    onChange={() => setIsVerified(!isVerified)}
                                />
                                <label className="text-sm text-gray-700">Verified</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outlined"
                                    onClick={onRequestClose}
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        backgroundColor: '#10B981',
                                        '&:hover': {
                                            backgroundColor: '#0E9F6E'
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
