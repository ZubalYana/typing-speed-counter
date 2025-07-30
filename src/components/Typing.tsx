import { useEffect, useState, useRef } from "react";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import axios from 'axios'

export default function TypingTest() {
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [errors, setErrors] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        const correctChars = text
            .split("")
            .filter((char, idx) => userInput[idx] === char).length;
        const totalTyped = userInput.length;

        const errCount = totalTyped - correctChars;
        setErrors(errCount < 0 ? 0 : errCount);

        if (totalTyped > 0) {
            setAccuracy(Math.round((correctChars / totalTyped) * 100));
        }

        const wordsTyped = userInput.trim().split(/\s+/).length;
        setWpm(Math.round((wordsTyped / (60 - timeLeft)) * 60 || 0));
    }, [userInput, timeLeft]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isRunning) setIsRunning(true);
        if (timeLeft <= 0) return;

        const newValue = e.target.value;
        const prevLength = userInput.length;
        const newLength = newValue.length;

        if (newLength < prevLength) {
            const lastTyped = userInput[prevLength - 1];
            const correctChar = text[prevLength - 1];

            if (lastTyped !== correctChar) {
                setUserInput(newValue);
            }
            return;
        }

        const nextCharIndex = userInput.length;
        const expectedChar = text[nextCharIndex];
        const typedChar = newValue[nextCharIndex];

        if (typedChar === expectedChar) {
            setUserInput(newValue);
        }
    }

    const restart = () => {
        setUserInput("");
        setTimeLeft(60);
        setIsRunning(false);
        setWpm(0);
        setAccuracy(0);
        setErrors(0);
        inputRef.current?.focus();
    };

    useEffect(() => {
        axios.get('http://localhost:5000/random-text').then(response => {
            setText(response.data.text);
        });
    }, []);

    return (
        <Box sx={{ maxWidth: "800px", mx: "auto", p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Typing Speed Test
            </Typography>

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
                    let style: React.CSSProperties = {};

                    if (i < userInput.length) {
                        style.color = userInput[i] === char ? "#4caf50" : "#f44336"; // green/red
                    } else if (i === userInput.length) {
                        style.color = "#000";
                        style.fontWeight = "bold";
                        style.textDecoration = "underline";
                    } else {
                        style.color = "#888";
                    }

                    return <span key={i} style={style}>{char}</span>;
                })}

            </Box>

            <TextField
                fullWidth
                inputRef={inputRef}
                multiline
                minRows={3}
                value={userInput}
                onChange={handleChange}
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
                        const pos = userInput.length;
                        input.setSelectionRange(pos, pos);
                    },
                    onKeyDown: (e) => {
                        if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }
                }}
            />


            <Button onClick={restart} variant="contained" color="primary">
                Restart
            </Button>
        </Box>
    );
}
