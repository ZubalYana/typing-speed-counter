import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    Stack,
    Select,
} from "@mui/material";
import type { SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import axios from "axios";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function TypingTest() {
    const [text, setText] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [mistakes, setMistakes] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [firstErrorIndex, setFirstErrorIndex] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [testingLanguage, setTestingLanguage] = useState<string>("English");
    const testingLanguagesOptions = ['English', 'Українська']
    const [duration, setDuration] = useState<number>(30);

    const timeRemaining = Math.max(0, duration - timeElapsed);
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

    useEffect(() => {
        if (started && !isFinished && timeElapsed >= duration) {
            setIsFinished(true);
        }
    }, [timeElapsed, duration, started, isFinished])

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

    const handleChange = (event: SelectChangeEvent) => {
        setTestingLanguage(event.target.value);
    };

    const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (isFinished) return;

        if (!started && e.key.length === 1) {
            setStarted(true);
        }

        //look if it'll be needed to block backspace in future
        const blocked = [
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
            "Delete",
        ];
        if (blocked.includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.key === "Backspace") {
            e.preventDefault();
            if (firstErrorIndex === null) {
                setUserInput((prev) => prev.slice(0, -1));
            }
            return;
        }

        if (e.key.length !== 1) {
            return;
        }

        const index = userInput.length;
        const typedChar = e.key;
        const expectedChar = text[index];

        if (firstErrorIndex === null) {
            if (typedChar === expectedChar) {
                setUserInput((prev) => prev + typedChar);
            } else {
                setMistakes((prev) => prev + 1);
                setFirstErrorIndex(index);
            }
        } else {
            if (index === firstErrorIndex) {
                if (typedChar === text[firstErrorIndex]) {
                    setFirstErrorIndex(null);
                    setUserInput((prev) => prev + typedChar);
                } else {
                    //still wrong, give feedback or ignore
                }
            }
        }
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

            <div className="w-[90%] flex justify-between">
                <div className="flex items-center">
                    <h5>Typing language:</h5>
                    <Select
                        value={testingLanguage}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            border: 'none',
                            boxShadow: 'none',
                            '& fieldset': { border: 'none' },
                            left: '-5px',
                            fontWeight: 600
                        }}
                    >
                        {testingLanguagesOptions.map((lang) => (
                            <MenuItem
                                key={lang}
                                value={lang}
                                sx={{
                                    textDecoration: 'none',

                                }}
                            >
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <Stack direction="row" spacing={1} alignItems="center">
                    <h5>Duration:</h5>
                    <ButtonGroup size="small" aria-label="typing duration" >
                        {[30, 60, 90].map((d) => (
                            <Button
                                key={d}
                                variant={duration === d ? "contained" : "outlined"}
                                onClick={() => setDuration(d)}
                                sx={{
                                    color: duration === d ? "#fff" : "#333",
                                    borderColor: "#10B981",
                                    backgroundColor: duration === d ? "#10B981" : "transparent",
                                    "&:hover": {
                                        backgroundColor: duration === d ? "#10B981" : "#f5f5f5",
                                    },
                                    fontWeight: 500
                                }}
                            >
                                {d}s
                            </Button>
                        ))}
                    </ButtonGroup>
                </Stack>

            </div>

            <div className="w-[90%] mb-4 wrap-break-word bg-[#fff] rounded-xl p-4 text-[20px] relative">
                {renderText()}
                <div
                    role="textbox"
                    aria-label="typing input"
                    tabIndex={0}
                    onKeyDown={handleKey}
                    style={{
                        outline: "none",
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 18,
                        fontFamily: "monospace",
                        background: "rgba(0,0,0,0)",
                        position: "absolute",
                        minHeight: 40,
                        userSelect: "none",
                        cursor: "text",
                        inset: 0,
                    }}
                >
                </div>
            </div>

            {!isFinished && (
                <h3>{timeRemaining}</h3>
            )}
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
