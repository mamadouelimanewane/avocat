"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface UserAvatarProps {
    name: string
    imageUrl?: string
    status?: 'online' | 'offline' | 'busy'
}

export function UserAvatar({ name, imageUrl, status = 'online' }: UserAvatarProps) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="relative inline-block">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
            >
                <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-indigo-500/20">
                    {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                {/* Status Indicator */}
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5 ${status === 'online' ? 'bg-emerald-500' :
                        status === 'busy' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
            </motion.div>
        </div>
    )
}
