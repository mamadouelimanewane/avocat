"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logoutClient } from "@/app/actions"

export function LogoutButton() {
    const handleLogout = async () => {
        await logoutClient()
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-red-600"
            onClick={handleLogout}
        >
            <LogOut className="h-5 w-5" />
        </Button>
    )
}
