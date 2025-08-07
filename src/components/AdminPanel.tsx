import { useState, useEffect } from 'react'
import axios from 'axios'
import logo from '../assets/logo.svg'
import { Pencil, Ban, Trash2 } from 'lucide-react'

export default function AdminPanel() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then((res) => {
                setUsers(res.data.users)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    return (
        <div className="w-full min-h-screen p-8 bg-gray-100 text-gray-800">
            <div className="flex items-center">
                <img src={logo} alt="logo" className="w-[30px]" />
                <h2 className="text-xl font-bold ml-2">DexType • Admin Panel</h2>
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4">User Management</h2>

            <div className="grid grid-cols-5 gap-4 p-3 bg-gray-300 rounded-lg font-semibold text-sm">
                <p>Name</p>
                <p>Email</p>
                <p>Status</p>
                <p>Registered</p>
                <p className="text-center">Actions</p>
            </div>

            {users.map((user: any) => (
                <div
                    key={user._id}
                    className="grid grid-cols-5 gap-4 items-center p-4 bg-white rounded-lg shadow-sm mt-2 hover:bg-gray-50 transition-all"
                >
                    <p className="truncate">{user.name}</p>
                    <p className="truncate">{user.email}</p>
                    <p className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isVerified ? 'Verified' : 'Not verified'}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(user.registered).toLocaleDateString()}</p>

                    <div className="flex justify-center gap-3">
                        <button className="p-2 hover:bg-blue-100 rounded-full cursor-pointer" title="Edit">
                            <Pencil className="w-5 h-5 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-yellow-100 rounded-full cursor-pointer" title="Block">
                            <Ban className="w-5 h-5 text-yellow-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-full cursor-pointer" title="Delete">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
