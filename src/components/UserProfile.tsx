import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserCircle2, LogOut } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DonutStat from './DonutStat';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
export default function UserProfile() {
    type User = {
        name: String;
        email: String;
    }

    const [user, setUser] = useState<User | null>(null)
    const [cpmData, setCpmData] = useState([]);
    const [summary, setSummary] = useState({ avgAccuracy: 0, totalTests: 0 });
    const [avgMistakes, setAvgMistakes] = useState(0);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            return;
        }
        axios.get('http://localhost:5000/user-profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                setUser(res.data.user);
            })
            .catch(err => {
                console.log('profile fetch error', err);
            });
    }, []);

    useEffect(() => {
        const fetchCpmStats = async () => {
            const token = localStorage.getItem("token");
            const language = "English"
            try {
                const res = await axios.get('http://localhost:5000/cpm-statistics', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        language: language,
                    },
                });

                const formatted = res.data.map((item: any) => ({
                    cpm: item.cpm,
                    mistakes: item.mistakes,
                    date: new Date(item.createdAt).toLocaleDateString(),
                })).reverse();

                setCpmData(formatted);
            } catch (err) {
                console.error("Failed to fetch CPM stats:", err);
            }
        };

        fetchCpmStats();
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:5000/typing-tests/summary", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSummary(res.data.summary);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            }
        };

        const fetchMistakeStats = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:5000/typing-tests", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const tests = res.data.tests;
                const totalMistakes = tests.reduce((sum: number, t: any) => sum + t.mistakes, 0);
                const avg = tests.length ? (totalMistakes / tests.length) : 0;
                setAvgMistakes(Number(avg.toFixed(2)));
            } catch (err) {
                console.error("Failed to fetch tests:", err);
            }
        };

        fetchSummary();
        fetchMistakeStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    }

    return (
        <div className='w-full p-8 pt-0 text-[#333]'>
            <h5 className="text-[28px] font-semibold mb-5">
                User Profile
            </h5>
            <div className='flex items-center'>
                <UserCircle2 size={90} strokeWidth={1.2} />
                <div className='ml-3'>
                    <h2 className='text-[24px] font-semibold'>{user?.name}</h2>
                    <h2 className='text-[16px]'>{user?.email}</h2>
                </div>
            </div>
            <h5 className="text-[24px] font-semibold mb-5 mt-10">
                Your typing speed statistics:
            </h5>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={cpmData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="cpm"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="CPM"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className='w-full flex justify-between'>
                <div className='w-[45%]'>
                    <h4 className="text-lg font-semibold mt-8 mb-2">Mistakes per attempt</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={cpmData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="mistakes"
                                    stroke="#e74242"
                                    strokeWidth={2}
                                    name="Mistakes"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='w-[45%] flex justify-center items-center'>
                    <div className="w-full flex justify-center gap-25 relative">
                        <DonutStat value={Number(summary.avgAccuracy.toFixed(1))} label="Avg Accuracy" unit="%" color="#10B981" />
                        <DonutStat value={avgMistakes} label="Avg Mistakes" color="#f87171" />
                    </div>
                </div>
            </div>
            <div className='mt-18'>
                <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    sx={{
                        borderColor: '#e74242',
                        width: '200px',
                        color: '#e74242',
                        borderWidth: '2px',
                        height: '45px'
                    }}
                    onClick={() => setOpenLogoutConfirm(true)}
                >
                    <LogOut size={17} className='mr-2' />
                    Log out
                </Button>
            </div>
            <Dialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
            >
                <div className='p-6 text-[#333]'>
                    <h4 className='text-[20px] font-medium'>Confirm Action</h4>
                    <p className='text-[16px] font-normal mt-1'>Are you sure you want to log out?</p>
                    <div className='w-full flex items-center justify-end mt-3 gap-3'>
                        <Button onClick={() => setOpenLogoutConfirm(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            color="error"
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
