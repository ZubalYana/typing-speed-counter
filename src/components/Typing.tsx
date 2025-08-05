import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import {
    Button,
    Stack,
    Select,
} from "@mui/material";
import type { SelectChangeEvent } from '@mui/material';
import { MenuItem } from '@mui/material';
import axios from "axios";
import ButtonGroup from "@mui/material/ButtonGroup";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ResultModal from "./ResultModal";
import { Clock } from "lucide-react";

export default function TypingTest() {
    const [text, setText] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [mistakes, setMistakes] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [firstErrorIndex, setFirstErrorIndex] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [testingLanguage, setTestingLanguage] = useState<string>(() => {
        return localStorage.getItem("typingLanguage") || "English";
    });
    const testingLanguagesOptions = ['English', 'Ukrainian']
    const [duration, setDuration] = useState<number>(30);
    const [isRotating, setIsRotating] = useState<boolean>(false);
    const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

    const timeRemaining = Math.max(0, duration - timeElapsed);
    const isLowTime = timeRemaining <= 10;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchText = (language: string) => {
        axios.get("http://localhost:5000/random-text", { params: { lang: language } }).then((res) => {
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
        fetchText(testingLanguage);
    }, [testingLanguage]);

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
        if (isFinished) {
            setShowResultsModal(true);

            const saveTestResult = async () => {
                const token = localStorage.getItem("token")
                try {
                    await axios.post(
                        'http://localhost:5000/typing-tests',
                        {
                            wpm,
                            cpm,
                            accuracy,
                            mistakes,
                            textLanguage: testingLanguage,
                            duration,
                            timeElapsed,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (error) {
                    console.error("Failed to save the test result:", error)
                }
            };
            saveTestResult();
        }
    }, [isFinished]);

    useEffect(() => {
        if (started && !isFinished && timeElapsed >= duration) {
            setIsFinished(true);
        }
    }, [timeElapsed, duration, started, isFinished])

    const resetTest = () => {
        setIsRotating(true);
        fetchText(testingLanguage);
        inputRef.current?.focus();

        setTimeout(() => {
            setIsRotating(false);
        }, 600);
    };
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };
    const renderText = () => {
        return text.split("").map((char, i) => {
            let color = "black";
            let background = "transparent";

            if (i < userInput.length) {
                color = "black";
                background = "rgba(16, 185, 129, 0.15)"
            }

            if (firstErrorIndex !== null && i === firstErrorIndex) {
                color = "red";
            }

            return (
                <span key={i} style={{ color, background, userSelect: "none" }}>
                    {char}
                </span>
            );
        });
    };
    const handleChange = (event: SelectChangeEvent) => {
        const lang = event.target.value;
        setTestingLanguage(lang);
        localStorage.setItem("typingLanguage", lang);
    };

    const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (isFinished) return;
        const index = userInput.length;
        const expectedChar = text[index];
        console.log({
            key: e.key,
            code: e.code,
            expectedChar,
            keyCode: e.key.charCodeAt(0),
            expectedCode: expectedChar?.charCodeAt(0),
        });


        if (!started && e.key.length === 1) {
            setStarted(true);
        }

        const blocked = [
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
            "Delete",
            "Backspace",
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

        const typedChar = e.key;

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
    const totalAttempts = correctChars + mistakes;
    const accuracy = totalAttempts > 0 ? (correctChars / totalAttempts) * 100 : 100;

    const timeUsedSeconds = isFinished && userInput.length === text.length
        ? timeElapsed
        : Math.min(timeElapsed, duration);
    const timeUsedMinutes = Math.max(1 / 60, timeUsedSeconds / 60);

    const cpm = Math.round(correctChars / timeUsedMinutes);
    const wpm = Math.round(cpm / 5);

    return (
        <div className="p-4 flex flex-col items-center w-full text-[#333]">
            <h5 className="text-[36px] font-semibold mb-8">
                Typing Speed Test
            </h5>

            <div className="w-[90%] flex justify-between">
                <div className="flex items-center w-[240px]">
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
                <div className="w-[150px] flex items-center justify-center">
                    {!isFinished && (
                        <div className="flex items-center">
                            <Clock />
                            <p
                                className="ml-2 text-[16px] font-semibold"
                                style={{
                                    color: isLowTime ? "#e74242" : "inherit",
                                    transition: "color 0.2s ease-in-out",
                                }}
                            >
                                {formatTime(timeRemaining)}
                            </p>

                        </div>
                    )}
                </div>
                <div className=" w-[240px] flex items-center justify-end">
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
            <div className="w-[90%] flex items-center">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={resetTest}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') resetTest(); }}
                    style={{ cursor: 'pointer' }}
                >
                    <RestartAltIcon className={isRotating ? "rotate-once" : ""} sx={{ fontSize: 28 }} />
                </div>

            </div>

            <ResultModal
                open={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                wpm={wpm}
                cpm={cpm}
                accuracy={accuracy}
                mistakes={mistakes}
                timeElapsed={timeElapsed}
            />

        </div>
    );
}
