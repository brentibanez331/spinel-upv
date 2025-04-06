'use client';

import { Chat } from '@/components/chat';


export default function ChatPage() {

    return (
        <div className="flex flex-col items-center px-4 w-full h-screen">
            <div className='w-full flex-grow py-10'>
                <Chat/>
            </div>
        </div>
    );
}