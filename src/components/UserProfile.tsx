import { useState, useEffect } from 'react'
import axios from 'axios'
import { UserCircle2 } from 'lucide-react'
export default function UserProfile() {
    type User = {
        name: String;
        email: String;
    }

    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token');

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
        </div>
    )
}
