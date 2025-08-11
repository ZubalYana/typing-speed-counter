import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminTextsHandling() {
    type Text = {
        _id: string;
        text: string;
        language: string;
    }

    const [texts, setTexts] = useState<Text[]>([]);

    const fetchTexts = () => {
        axios.get('http://localhost:5000/texts')
            .then((res) => {
                setTexts(res.data);
            })
            .catch((err) => {
                console.error('An error occurred while fetching texts:', err)
            })
    }
    useEffect(() => {
        fetchTexts();
    }, [])

    const trimText = (text: string, requiredLength: number) => {
        if (text.length > requiredLength) {
            text.slice(requiredLength)
            return `${text}...`
        }
    }

    const languageFlagMap: Record<string, string> = {
        English: "us",
        Ukrainian: "ua",
    };
    return (
        <div>
            <h2 className="text-lg font-semibold mt-8 mb-4">Texts Management</h2>
            <div className='w-full flex flex-wrap gap-x-4'>
                {texts.map((text) => (
                    <div id={text._id} className='w-[470px] h-[250px] bg-[#f5f5f5] rounded-xl shadow-xl p-4'>
                        <p className='text-[14px]'><span className='font-semibold mr-2'>Language:</span>
                            <span
                                className={`fi fi-${languageFlagMap[text.language]}`}
                                style={{ marginRight: 4, width: 20, height: 14 }}
                            ></span>
                            {text.language}
                        </p>
                        <p className='text-[14px]'><span className='font-semibold mr-1'>Text:</span>{trimText(text.text, 80)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
