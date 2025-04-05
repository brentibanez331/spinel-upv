import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function ChatSide() {
    return (
        <div className="w-[370px] flex flex-col px-4 py-10 fixed right-0 h-screen">
            <div>Chat</div>
            <div className="flex-grow w-full border border-neutral-400 my-8 rounded-xl">

            </div>
            <div className="relative">
                <Textarea placeholder="Ilapag ang iyong mga tanong..." />
                <Send className="absolute right-4 bottom-4 cursor-pointer" />

            </div>
        </div>
    )
}