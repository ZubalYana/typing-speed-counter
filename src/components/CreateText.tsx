import { useState, useEffect } from "react";
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

    const calculateDifficulty = (str: string) => {
        if (!str) return "Easy";

        const length = str.length;
        const upperRatio = (str.match(/[A-ZА-Я]/g) || []).length / length;
        const numberRatio = (str.match(/[0-9]/g) || []).length / length;
        const symbolRatio = (str.match(/[^a-zA-Zа-яА-Я0-9\s]/g) || []).length / length;

        const score = (upperRatio * 1) + (numberRatio * 2) + (symbolRatio * 3);

        if (length < 600) return "Too Short";
        if (score < 0.10) return "Easy";
        if (score < 0.17) return "Medium";
        return "Hard";
    };

    useEffect(() => {
        setDifficultyLevel(calculateDifficulty(text));
    }, [text]);

    const handleSave = () => {
        if (!text.trim()) return;
        if (text.length < 600) {
            alert("Text must be at least 600 characters long.");
            return;
        }
        onSave({ text, language, difficultyLevel });
        setText("");
        setLanguage("English");
        setDifficultyLevel("Easy");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Create New Text</h2>
                <TextField
                    label="Text"
                    multiline
                    rows={6}
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

                <div className="flex items-center mt-2">
                    <h3>Difficulty Level:</h3>
                    <div className="flex items-center ml-2">
                        <div
                            className={`w-[15px] h-[15px] rounded-full mr-1 ${difficultyLevel === "Easy"
                                ? "bg-green-600"
                                : difficultyLevel === "Medium"
                                    ? "bg-amber-600"
                                    : difficultyLevel === "Hard"
                                        ? "bg-red-600"
                                        : "bg-gray-500"
                                }`}
                        ></div>
                        <span className="font-semibold">{difficultyLevel}</span>
                    </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ borderColor: '#DC2626', color: '#DC2626' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
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
