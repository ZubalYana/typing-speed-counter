import { useState, useEffect } from 'react'
import axios from 'axios'

type TypingTest = {
    _id: string;
    wpm: number;
    cpm: number;
    accuracy: number;
    mistakes: number;
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
        <div className="p-8 w-full flex flex-col items-center text-[#333]">
            <h5 className="text-[24px] font-semibold mb-5">My Test History</h5>
            <div className="w-[90%]">
                <div className="flex w-full p-3 bg-gray-300 rounded-lg font-semibold text-sm">
                    <p className="w-[120px]">Date</p>
                    <p className="w-[100px]">Language</p>
                    <p className="w-[80px]">WPM</p>
                    <p className="w-[80px]">CPM</p>
                    <p className="w-[100px]">Accuracy</p>
                    <p className="w-[80px]">Mistakes</p>
                </div>

                {tests.map((test) => (
                    <div
                        key={test._id}
                        className="flex w-full p-3 border-b border-gray-200"
                    >
                        <p className="w-[120px]">
                            {new Date(test.createdAt).toLocaleDateString()}
                        </p>
                        <p className="w-[100px]">{test.textLanguage}</p>
                        <p className="w-[80px]">{test.wpm}</p>
                        <p className="w-[80px]">{test.cpm}</p>
                        <p className="w-[100px]">{test.accuracy.toFixed(2)}%</p>
                        <p className="w-[80px]">{test.mistakes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}