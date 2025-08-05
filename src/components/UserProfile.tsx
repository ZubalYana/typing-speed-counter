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
        <div className='w-full p-8'>
            <h5 className="text-[36px] font-semibold mb-8">
                User Profile
            </h5>
            <div>
                <UserCircle2 />
                <div>
                    <h2>{user?.name}</h2>
                    <h2>{user?.email}</h2>
                </div>
            </div>
        </div>
    )
}
