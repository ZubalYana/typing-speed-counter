import { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import axios from 'axios';

export default function TypingTest() {
    const [text, setText] = useState('');
    const [fullUserInput, setFullUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [errors, setErrors] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axios.get('http://localhost:5000/random-text')
            .then(res => setText(res.data.text))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        const correctChars = fullUserInput
            .split("")
            .filter((char, i) => char === text[i])
            .length;
        const totalTyped = fullUserInput.length;
        const errCount = totalTyped - correctChars;

        setErrors(errCount > 0 ? errCount : 0);
        setAccuracy(totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0);
        setWpm(timeLeft < 60 ? Math.round((fullUserInput.trim().split(/\s+/).length / (60 - timeLeft)) * 60) : 0);
    }, [fullUserInput, timeLeft, text]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isRunning) setIsRunning(true);
        if (timeLeft <= 0) return;

        const newValue = e.target.value;

        if (newValue.length > fullUserInput.length) {
            const nextChar = newValue[newValue.length - 1];
            setFullUserInput(prev => prev + nextChar);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const forbidden = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (forbidden.includes(e.key)) {
            e.preventDefault();
        }
    };

    const restart = () => {
        setIsRunning(false);
        setTimeLeft(60);
        setFullUserInput('');
        setWpm(0);
        setAccuracy(0);
        setErrors(0);
        inputRef.current?.focus();
    };

    return (
        <Box sx={{ maxWidth: "800px", mx: "auto", p: 4 }}>
            <Typography variant="h4" gutterBottom>Typing Speed Test</Typography>

            <Stack direction="row" spacing={3} mb={2}>
                <Typography>⏳ {timeLeft}s</Typography>
                <Typography>⚡ WPM: {wpm}</Typography>
                <Typography>🎯 Accuracy: {accuracy}%</Typography>
                <Typography>❌ Errors: {errors}</Typography>
            </Stack>

            <Box
                sx={{
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    mb: 2,
                    minHeight: "120px",
                    fontSize: "20px",
                    lineHeight: "1.6",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f9f9f9"
                }}
            >
                {text.split("").map((char, i) => {
                    const typedChar = fullUserInput[i];
                    let style: React.CSSProperties = { color: "#888" };

                    if (typedChar != null) {
                        style.color = typedChar === char ? "#4caf50" : "#f44336";
                    }

                    if (i === fullUserInput.length) {
                        style.fontWeight = "bold";
                        style.textDecoration = "underline";
                        style.color = "#000";
                    }

                    return <span key={i} style={style}>{char}</span>;
                })}
            </Box>

            <TextField
                fullWidth
                inputRef={inputRef}
                multiline
                minRows={3}
                value={fullUserInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={timeLeft === 0}
                placeholder="Start typing here..."
                sx={{ mb: 2 }}
                inputProps={{
                    spellCheck: false,
                    autoComplete: 'off',
                    onPaste: (e) => e.preventDefault(),
                    onCut: (e) => e.preventDefault(),
                    onSelect: (e) => {
                        const input = e.target as HTMLInputElement;
                        const pos = fullUserInput.length;
                        input.setSelectionRange(pos, pos);
                    }
                }}
            />

            <Button onClick={restart} variant="contained" color="primary">
                Restart
            </Button>
        </Box>
    );
}
