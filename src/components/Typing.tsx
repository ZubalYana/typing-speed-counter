import { useState, useEffect } from 'react'
import axios from 'axios'
export default function Typing() {
    const [text, setText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/random-text').then((res) => {
            setText(res.data.text)
        })
    })
    return (
        <div className='w-full p-4'>
            <div className='rounded-[16px] border-[2px] border-[#333] p-4'>
                <p className='text-[18px]'>{text}</p>
            </div>
        </div>
    )
}
