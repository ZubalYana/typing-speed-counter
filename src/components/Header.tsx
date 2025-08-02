import logo from '../assets/logo.svg'
import { UserCircle2Icon } from 'lucide-react'
export default function Header() {
    return (
        <div className="p-8 flex justify-between items-center text-[#333]">
            <div className='flex'>
                <img src={logo} alt="logo" className='w-[25px]' />
                <h2 className='text-[20px] font-semibold ml-2'>DexType</h2>
            </div>
            <div>
                <UserCircle2Icon size={30} />
            </div>
        </div>
    )
}
