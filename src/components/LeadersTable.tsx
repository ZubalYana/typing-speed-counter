import { useState, useEffect } from 'react';
import axios from 'axios';

type LeaderUser = {
    name?: string;
    email?: string;
    registered?: string;
};

type TypingTest = {
    _id: string;
    user: LeaderUser | string;
    cpm: number;
    wpm: number;
    accuracy: number;
};

type TypingTestsResponse = {
    tests: TypingTest[];
};

export default function LeadersTable() {
    const [typingTests, setTypingTests] = useState<TypingTest[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get<TypingTestsResponse>('http://localhost:5000/typing-tests', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                console.log(res.data);
                setTypingTests(res.data.tests || []);
            })
            .catch((err) => {
                console.error('Failed to fetch typing tests data:', err);
            });
    }, []);

    return (
        <div className="p-8 pt-0 w-full flex flex-col items-center text-[#333]">
            <h5 className="text-[28px] font-semibold mb-5">Leaders Table</h5>
            <div className="w-[80%]">
                <div className="flex w-full p-3 bg-gray-300 rounded-lg font-semibold text-sm">
                    <p className="w-[100px]">Place</p>
                    <p className="w-[200px]">Name</p>
                    <p className="flex-1">Email</p>
                    <p className="w-[120px]">CPM</p>
                    <p className="w-[120px]">WPM</p>
                    <p className="w-[100px]">Accuracy</p>
                </div>

                {typingTests.map((test, index) => (
                    <div
                        key={test._id}
                        className="flex w-full p-3 border-b border-gray-200"
                    >
                        <p className="w-[100px]">{index + 1}</p>
                        <p className="w-[200px]">
                            {typeof test.user === 'object' ? test.user.name : 'Unknown'}
                        </p>
                        <p className="flex-1 truncate">
                            {typeof test.user === 'object' ? test.user.email : '-'}
                        </p>
                        <p className="w-[120px]">{test.cpm}</p>
                        <p className="w-[120px]">{test.wpm}</p>
                        <p className="w-[100px]">{test.accuracy.toFixed(2)}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
