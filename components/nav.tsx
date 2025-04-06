'use client'

import { BotMessageSquare, Heart, Menu, Rocket, User, Vote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSelectedLayoutSegments } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";

export default function Nav({ children, params }: { children: ReactNode, params: {} }) {
    const segments = useSelectedLayoutSegments()
    const { id } = useParams() as { id?: string }

    const [showSidebar, setShowSidebar] = useState(false);

    const pathname = usePathname();

    const tabs = useMemo(() => {
        return [
            {
                name: 'Candidates',
                href: '/dashboard',
                isActive: segments[0] === "dashboard",
                icon: <Rocket width={18} />
            },
            {
                name: 'GabayChat',
                href: '/chat',
                isActive: segments[0] === "chat",
                icon: <BotMessageSquare width={18} />
            },
            {
                name: 'Candidate Builder',
                href: '/candidate-builder',
                isActive: segments[0] === "candidate-builder",
                icon: <Vote width={18} />
            },
            {
                name: 'My Favorites',
                href: '/my-favorites',
                isActive: segments[0] === "my-favorites",
                icon: <Heart width={18} />
            },
            
            {
                name: 'My Profile',
                href: '/profile',
                isActive: segments[0] === "profile",
                icon: <User width={18} />
            }
        ]
    }, [segments, id])

    return (
        <>
            <button
                className={`fixed z-20 ${
                    // left align for Editor, right align for other pages
                    segments[0] === "post" && segments.length === 2 && !showSidebar
                        ? "left-5 top-5"
                        : "right-5 top-7"
                    } sm:hidden`}
                onClick={() => setShowSidebar(!showSidebar)}>
                <Menu width={20} />
            </button>

            <div
                className={`transform ${showSidebar ? "w-full translate-x-0" : "-translate-x-full"
                    } fixed z-10 flex h-full flex-col justify-between border-stone-200 bg-white transition-all sm:w-60 sm:translate-x-0`}
            >
                <div className="flex grid w-max flex-col items-center gap-2 sm:w-52 mx-4">
                    <div className="flex flex-col items-center justify-center space-x-2 space-y-4 rounded-lg px-4 pb-2 pt-6 sm:w-52">
                    </div>

                    <div className="grid gap-2">
                        {tabs.map(({ name, href, isActive, icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center space-x-3 ${isActive
                                    ? "bg-[#17175B]/10 text-[#17175B] dark:bg-stone-700"
                                    : ""
                                    } relative rounded-lg px-4 py-2 transition-all duration-150 ease-in-out hover:bg-[#17175B]/10 active:bg-stone-300`}
                            >
                                {icon}
                                <span className="text-sm font-medium">{name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <form action={signOutAction}>
                    <Button type="submit" variant={"outline"}>
                        Sign out
                    </Button>
                </form>
            </div>
        </>
    )
}