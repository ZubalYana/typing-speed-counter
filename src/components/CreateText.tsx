import { useState } from "react";
import {
    Dialog,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from "@mui/material";

interface CreateTextProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: {
        text: string;
        language: string;
        difficultyLevel: string;
    }) => void;
}

export default function CreateText({ open, onClose, onSave }: CreateTextProps) {
    const [text, setText] = useState("");
    const [language, setLanguage] = useState("English");
    const [difficultyLevel, setDifficultyLevel] = useState("Easy");

    const handleSave = () => {
        if (!text.trim()) return;
        onSave({ text, language, difficultyLevel });
        setText("");
        setLanguage("English");
        setDifficultyLevel("Easy");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Create New Text</h2>
                <TextField
                    label="Text"
                    multiline
                    rows={4}
                    fullWidth
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Ukrainian">Ukrainian</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Difficulty Level</InputLabel>
                    <Select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                    >
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                    </Select>
                </FormControl>
                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        color="primary"
                        sx={{ borderColor: '#DC2626', color: '#DC2626' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ backgroundColor: '#10B981' }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
