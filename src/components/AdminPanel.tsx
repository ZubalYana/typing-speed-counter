import { useState, useEffect } from 'react'
import axios from 'axios'
import logo from '../assets/logo.svg'
import { Pencil, Ban, Trash2 } from 'lucide-react'
import useAlertStore from "../stores/useAlertStore"
import EditUserModal from './EditUserModal'
import {
    Dialog,
    Button
} from '@mui/material';


export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const { showAlert } = useAlertStore()
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    const fetchUsers = () => {
        axios.get('http://localhost:5000/users')
            .then((res) => setUsers(res.data.users))
            .catch((err) => {
                console.error(err)
                showAlert("Failed to fetch users", "error")
            })
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const confirm = (message: string, action: () => void) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmOpen(true);
    };

    const handleDelete = async (id: string) => {
        confirm("Are you sure you want to delete this user?", async () => {
            try {
                await axios.delete(`http://localhost:5000/users/${id}`);
                showAlert("User deleted successfully", "success");
                fetchUsers();
            } catch {
                showAlert("Failed to delete user", "error");
            }
        });
    };

    const handleBlockToggle = async (id: string, currentlyBlocked: boolean) => {
        confirm(
            `Are you sure you want to ${currentlyBlocked ? 'unblock' : 'block'} this user?`,
            async () => {
                try {
                    await axios.patch(`http://localhost:5000/users/${id}/block`, {
                        block: !currentlyBlocked
                    });
                    showAlert(`User ${!currentlyBlocked ? 'blocked' : 'unblocked'} successfully`, "success");
                    fetchUsers();
                } catch {
                    showAlert("Failed to update block status", "error");
                }
            }
        );
    };

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
                        {user.isVerified ? 'Verified' : 'Not verified'} {user.isBlocked && <span className="text-yellow-500 ml-2">(Blocked)</span>}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(user.registered).toLocaleDateString()}</p>

                    <div className="flex justify-center gap-3">
                        <button
                            className="p-2 hover:bg-blue-100 rounded-full cursor-pointer"
                            title="Edit"
                            onClick={() => setEditingUser(user)}
                        >
                            <Pencil className="w-5 h-5 text-blue-600" />
                        </button>

                        <button
                            className="p-2 hover:bg-yellow-100 rounded-full cursor-pointer"
                            title={user.isBlocked ? "Unblock" : "Block"}
                            onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                        >
                            <Ban className="w-5 h-5 text-yellow-600" />
                        </button>

                        <button
                            className="p-2 hover:bg-red-100 rounded-full cursor-pointer"
                            title="Delete"
                            onClick={() => handleDelete(user._id)}
                        >
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>
            ))}
            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    onRequestClose={() => setEditingUser(null)}
                    user={editingUser}
                    onSave={() => {
                        setEditingUser(null)
                        fetchUsers()
                    }}
                />
            )}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <div className='p-4 text-[#333]'>
                    <h4 className='text-[20px] font-medium'>Confirm Action</h4>
                    <p className='text-[16px] font-normal mt-1'>{confirmMessage}</p>
                    <div className='w-full flex items-center justify-end mt-3'>
                        <Button onClick={() => setConfirmOpen(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (confirmAction) confirmAction();
                                setConfirmOpen(false);
                            }}
                            color="error"
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>


        </div>
    )
}
