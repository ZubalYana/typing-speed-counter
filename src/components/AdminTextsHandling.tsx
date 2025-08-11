import { useState, useEffect } from 'react'
import axios from 'axios'
import { Pencil, Trash2 } from 'lucide-react'
import { Dialog, Button } from '@mui/material';
import useAlertStore from "../stores/useAlertStore"
import EditTextModal from './EditTextModal';

export default function AdminTextsHandling() {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedText, setSelectedText] = useState<any>(null);

    const { showAlert } = useAlertStore()

    type Text = {
        _id: string;
        text: string;
        language: string;
    }

    const [texts, setTexts] = useState<Text[]>([]);

    const fetchTexts = () => {
        axios.get('http://localhost:5000/texts')
            .then((res) => setTexts(res.data))
            .catch((err) => {
                console.error('An error occurred while fetching texts:', err)
            })
    }
    useEffect(() => {
        fetchTexts();
    }, [])

    const trimText = (text: string, requiredLength: number) => {
        if (text.length > requiredLength) {
            return text.slice(0, requiredLength) + "...";
        }
        return text;
    }

    const languageFlagMap: Record<string, string> = {
        English: "us",
        Ukrainian: "ua",
    };

    const confirm = (message: string, action: () => void) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmOpen(true);
    };

    const handleDelete = (id: string) => {
        confirm("Are you sure you want to delete this text?", async () => {
            try {
                await axios.delete(`http://localhost:5000/texts/${id}`);
                showAlert("Text deleted successfully", "success");
                fetchTexts();
            } catch {
                showAlert("Failed to delete text", "error");
            }
        });
    };

    const handleEdit = (text: Text) => {
        setSelectedText(text);
        setEditModalOpen(true);
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mt-8 mb-4">Texts Management</h2>
            <div className='w-full flex flex-wrap gap-x-4 gap-y-4'>
                {texts.map((text) => (
                    <div key={text._id} className='w-[470px] h-[250px] bg-[#f5f5f5] rounded-xl shadow-xl p-4 relative pb-[70px]'>
                        <div className='flex absolute gap-3 bottom-4 right-4'>
                            <button
                                className="p-2 hover:bg-blue-100 rounded-full cursor-pointer"
                                onClick={() => handleEdit(text)}
                            >
                                <Pencil className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                                className="p-2 hover:bg-red-100 rounded-full cursor-pointer"
                                onClick={() => handleDelete(text._id)}
                            >
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                        <p className='text-[14px]'>
                            <span className='font-semibold mr-2'>Language:</span>
                            <span
                                className={`fi fi-${languageFlagMap[text.language]}`}
                                style={{ marginRight: 4, width: 20, height: 14 }}
                            ></span>
                            {text.language}
                        </p>
                        <p className='text-[14px] mt-2'>
                            <span className='font-semibold mr-1'>Text:</span>
                            {trimText(text.text, 310)}
                        </p>
                    </div>
                ))}
            </div>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
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

            <EditTextModal
                isOpen={editModalOpen}
                onRequestClose={() => setEditModalOpen(false)}
                textData={selectedText}
                onSave={fetchTexts}
            />
        </div>
    )
}
