import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/logo.svg';
import { UserCircle2Icon } from 'lucide-react';

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");

        if (!token) {
            navigate("/auth");
            return;
        }

        if (name) {
            setUserName(name);
        } else {
            setUserName(null);
        }
    }, [navigate]);

    const handleClick = () => {
        if (userName) {
            navigate('/profile');
        } else {
            navigate("/auth");
        }
    };

    const goTyping = () => navigate('/');
    const goLeaders = () => navigate('/leaders-table');

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="p-8 flex justify-between items-center text-[#333]">
            <div className='flex'>
                <img src={logo} alt="logo" className='w-[25px]' />
                <h2 className='text-[20px] font-semibold ml-2'>DexType</h2>
            </div>
            <div className="flex gap-[100px]">
                <p
                    onClick={goTyping}
                    className={`text-[18px] font-medium cursor-pointer ${isActive('/') ? 'text-[#10B981] font-semibold' : ''}`}
                >
                    Typing
                </p>
                <p
                    onClick={goLeaders}
                    className={`text-[18px] font-medium cursor-pointer ${isActive('/leaders-table') ? 'text-[#10B981] font-semibold' : ''}`}
                >
                    Leaders table
                </p>
            </div>
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleClick}
            >
                <UserCircle2Icon size={30} />
                {userName && <span className="font-medium">{userName}</span>}
            </div>
        </div>
    );
}
