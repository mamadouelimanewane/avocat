
"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function PrintHandler() {
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('print') === 'true') {
            // Wait a bit for the content to render
            const timer = setTimeout(() => {
                window.print()
                // Optionally close window after print
                // window.close()
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [searchParams])

    return null
}
