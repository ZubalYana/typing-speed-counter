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
    const [timeElapsed, setTimeElapsed] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchText = () => {
        axios.get("http://localhost:5000/random-text").then((res) => {
            setText(res.data.text);
            setUserInput("");
            setMistakes(0);
            setStarted(false);
            setIsFinished(false);
            setFirstErrorIndex(null);
            setTimeElapsed(0);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        });
    };

    useEffect(() => {
        fetchText();
    }, []);

    useEffect(() => {
        if (started && !timerRef.current && !isFinished) {
            timerRef.current = setInterval(() => {
                setTimeElapsed((t) => t + 1);
            }, 1000)
        }
    }, [started, isFinished])

    useEffect(() => {
        if (isFinished && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [isFinished]);

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

    const correctChars = userInput.length;
    const totalAttemps = correctChars + mistakes;
    const accuracy = totalAttemps > 0 ? (correctChars / totalAttemps) * 100 : 100;

    const timeMinutes = timeElapsed / 60 || 1;
    const wpm = Math.round((correctChars / 5) / timeMinutes);

    return (
        <div className="p-4 pt-8 flex flex-col items-center w-full h-screen text-[#333]">
            <h5 className="text-[32px] font-semibold">
                Typing Speed Test
            </h5>

            <div className="w-[90%] my-4 wrap-break-word bg-[#fff] rounded-xl p-4 text-[20px]">
                {renderText()}
            </div>

            <div className="w-[90%]">
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
            </div>

            <Stack direction="row" spacing={2} mt={2}>
                <Typography>Mistakes: {mistakes}</Typography>
                <Button variant="outlined" onClick={resetTest}>
                    Restart
                </Button>
            </Stack>

            {isFinished && (
                <Box mt={4}>
                    <Typography variant="h6">Statistics</Typography>
                    <Typography>WPM: {wpm}</Typography>
                    <Typography>Accuracy: {accuracy.toFixed(2)}%</Typography>
                    <Typography>Total Errors: {mistakes}</Typography>
                    <Typography>Time elapsed: {timeElapsed} seconds</Typography>
                </Box>
            )}
        </div>
    );
}
