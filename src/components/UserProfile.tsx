import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserCircle2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserProfile() {
    type User = {
        name: String;
        email: String;
    }

    const [user, setUser] = useState<User | null>(null)
    const [cpmData, setCpmData] = useState([]);
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


    return (
        <div className='w-full p-8 pt-0 text-[#333]'>
            <h5 className="text-[36px] font-semibold mb-5">
                User Profile
            </h5>
            <div className='flex items-center'>
                <UserCircle2 size={90} strokeWidth={1.5} />
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
                <h4 className="text-lg font-semibold mt-8 mb-2">Mistakes per attempt</h4>
                <div style={{ width: '45%', height: 300 }}>
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


        </div>
    )
}
