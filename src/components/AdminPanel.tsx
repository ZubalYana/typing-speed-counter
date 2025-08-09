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
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
type User = {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    isBlocked: boolean;
    registered: string;
    role: string;
};


export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { showAlert } = useAlertStore()
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'not_verified'>('all');
    const [filterBlocked, setFilterBlocked] = useState<'all' | 'blocked' | 'not_blocked'>('all');
    const [roleFilter, setRoleFilter] = useState('');

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

    const filteredUsers = users
        .filter((user) => {
            if (filterStatus === 'verified' && !user.isVerified) return false;
            if (filterStatus === 'not_verified' && user.isVerified) return false;
            if (filterBlocked === 'blocked' && !user.isBlocked) return false;
            if (filterBlocked === 'not_blocked' && user.isBlocked) return false;
            if (roleFilter !== '' && user.role !== roleFilter) return false;
            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.registered).getTime();
            const dateB = new Date(b.registered).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });


    return (
        <div className="w-full min-h-screen p-8 bg-gray-100 text-gray-800">
            <div className="flex items-center">
                <img src={logo} alt="logo" className="w-[30px]" />
                <h2 className="text-xl font-bold ml-2">DexType • Admin Panel</h2>
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4">User Management</h2>
            <div className="flex gap-4 mb-4">
                <FormControl size="small" className="min-w-[180px]" sx={{ minWidth: 140 }}>
                    <InputLabel id="filter-status-label">Verification Status</InputLabel>
                    <Select
                        labelId="filter-status-label"
                        value={filterStatus}
                        label="Verification Status"
                        onChange={(e) =>
                            setFilterStatus(e.target.value as 'all' | 'verified' | 'not_verified')
                        }
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="not_verified">Not Verified</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" className="min-w-[180px]" sx={{ minWidth: 140 }}>
                    <InputLabel id="filter-blocked-label">Block Status</InputLabel>
                    <Select
                        labelId="filter-blocked-label"
                        value={filterBlocked}
                        label="Block Status"
                        onChange={(e) =>
                            setFilterBlocked(e.target.value as 'all' | 'blocked' | 'not_blocked')
                        }
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="blocked">Blocked</MenuItem>
                        <MenuItem value="not_blocked">Not Blocked</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="sort-order-label">Sort by Date</InputLabel>
                    <Select
                        fullWidth
                        labelId="sort-order-label"
                        value={sortOrder}
                        label="Sort by Date"
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="oldest">Oldest First</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="grid grid-cols-5 gap-4 p-3 bg-gray-300 rounded-lg font-semibold text-sm">
                <p>Name</p>
                <p>Email</p>
                <p>Status</p>
                <p>Registered</p>
                <p className="text-center">Actions</p>
            </div>

            {filteredUsers.map((user: User) => (
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
