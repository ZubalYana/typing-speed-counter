import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Stack,
} from "@mui/material";
import axios from "axios";

export default function TypingTest() {
    const [text, setText] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [mistakes, setMistakes] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [firstErrorIndex, setFirstErrorIndex] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const fetchText = () => {
        axios.get("http://localhost:5000/random-text").then((res) => {
            setText(res.data.text);
            setUserInput("");
            setMistakes(0);
            setStarted(false);
            setIsFinished(false);
            setFirstErrorIndex(null);
        });
    };

    useEffect(() => {
        fetchText();
    }, []);

    useEffect(() => {
        if (started && userInput.length === text.length) {
            setIsFinished(true);
        }
    }, [userInput, text, started]);

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (isFinished) return;

        const val = e.target.value;

        if (val.length < userInput.length) {
            return;
        }

        if (val.length > userInput.length + 1) {
            return;
        }

        if (firstErrorIndex === null) {
            const index = userInput.length;
            const typedChar = val[index];
            const expectedChar = text[index];

            if (typedChar === expectedChar) {
                setUserInput((prev) => prev + typedChar);
            } else {
                setMistakes((prev) => prev + 1);
                setFirstErrorIndex(index);
            }
        } else {
            if (val.length === firstErrorIndex + 1) {
                const typedChar = val[firstErrorIndex];
                const expectedChar = text[firstErrorIndex];
                if (typedChar === expectedChar) {
                    setFirstErrorIndex(null);
                    setUserInput(val);
                } else {
                }
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Backspace" ||
            e.key === "Delete" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === "Home" ||
            e.key === "End"
        ) {
            e.preventDefault();
        }
    };

    const resetTest = () => {
        fetchText();
        inputRef.current?.focus();
    };

    const renderText = () => {
        return text.split("").map((char, i) => {
            let color = "black";

            if (i < userInput.length) {
                color = "green";
            }

            if (firstErrorIndex !== null && i === firstErrorIndex) {
                color = "red";
            }

            return (
                <span key={i} style={{ color, userSelect: "none" }}>
                    {char}
                </span>
            );
        });
    };

    return (
        <Box p={4}>
            <Typography variant="h5" gutterBottom>
                Typing Test
            </Typography>

            <Box mb={2} fontSize="1.2rem" sx={{ wordWrap: "break-word" }}>
                {renderText()}
            </Box>

            <TextField
                inputRef={inputRef}
                variant="outlined"
                fullWidth
                placeholder="Start typing..."
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                value={userInput}
                disabled={isFinished}
                onFocus={() => setStarted(true)}
                autoFocus
            />

            <Stack direction="row" spacing={2} mt={2}>
                <Typography>Mistakes: {mistakes}</Typography>
                <Button variant="outlined" onClick={resetTest}>
                    Restart
                </Button>
            </Stack>
        </Box>
    );
}
