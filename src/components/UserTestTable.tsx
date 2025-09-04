import { useState, useEffect } from 'react'
import axios from 'axios'

type TypingTest = {
    _id: string;
    wpm: number;
    cpm: number;
    accuracy: number;
    mistakes: number;
    difficultyLevel: string;
    textLanguage: string;
    createdAt: string;
};

type TypingTestResponse = {
    tests: TypingTest[];
};

export default function UserTestTable() {
    const [tests, setTests] = useState<TypingTest[]>([])

    useEffect(() => {
        const token = localStorage.getItem('token')

        axios
            .get<TypingTestResponse>("http://localhost:5000/typing-tests", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setTests(res.data.tests || []))
            .catch((err) =>
                console.error("Failed to fetch typing tests data:", err)
            );
    }, [])

    return (
        <div className="py-8 w-full flex flex-col items-center text-[#333]">
            <h5 className="text-[24px] font-semibold mb-5">My Test History</h5>

            <div className="w-full max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                <div className="flex w-full p-3 bg-gray-300 font-semibold text-sm sticky top-0 z-10">
                    <p className="flex-1">Date</p>
                    <p className="flex-1">Language</p>
                    <p className="flex-1">Difficulty</p>
                    <p className="flex-1">WPM</p>
                    <p className="flex-1">CPM</p>
                    <p className="flex-1">Accuracy</p>
                    <p className="flex-1">Mistakes</p>
                </div>

                {tests.map((test) => (
                    <div key={test._id} className="flex w-full p-3 border-b border-gray-200">
                        <p className="flex-1">{new Date(test.createdAt).toLocaleDateString()}</p>
                        <p className="flex-1">{test.textLanguage}</p>
                        <p className="flex-1">{test.difficultyLevel}</p>
                        <p className="flex-1">{test.wpm}</p>
                        <p className="flex-1">{test.cpm}</p>
                        <p className="flex-1">{test.accuracy.toFixed(2)}%</p>
                        <p className="flex-1">{test.mistakes}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}