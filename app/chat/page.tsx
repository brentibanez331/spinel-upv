'use client';

import { Chat } from '@/components/chat';


export default function ChatPage() {

    return (
        <div className="max-w-6xl flex flex-col items-center w-full h-full">
            <div className='w-full'>
                <Chat/>
            </div>
        </div>
    );
}