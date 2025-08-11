import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useAlertStore from '../stores/useAlertStore';
import axios from 'axios';
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    Button
} from '@mui/material';

type EditTextModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    textData: any;
    onSave: () => void;
};

export default function EditTextModal({ isOpen, onRequestClose, textData, onSave }: EditTextModalProps) {
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('');
    const { showAlert } = useAlertStore();

    useEffect(() => {
        if (textData) {
            setText(textData.text);
            setLanguage(textData.language);
        }
    }, [textData]);

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/texts/${textData._id}`, {
                text,
                language,
            });
            showAlert('Text updated successfully', 'success');
            onSave();
            onRequestClose();
        } catch {
            showAlert('Failed to update text', 'error');
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
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                                onClick={onRequestClose}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Edit Text</h2>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="language-select-label">Language</InputLabel>
                                <Select
                                    labelId="language-select-label"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Ukrainian">Ukrainian</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                fullWidth
                                multiline
                                rows={5}
                                margin="normal"
                            />

                            <div className="flex justify-end mt-4 gap-2">
                                <Button
                                    variant="outlined"
                                    onClick={onRequestClose}
                                    color="primary"
                                    sx={{ borderColor: '#DC2626', color: '#DC2626' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
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
