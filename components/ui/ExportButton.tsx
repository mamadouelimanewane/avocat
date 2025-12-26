
"use client"

import React from "react"
import { utils, writeFile } from "xlsx"
import { Download } from "lucide-react"
import { Button } from "./button"

interface ExportButtonProps {
    data: any[]
    filename?: string
    sheetName?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium"
    className?: string
    label?: string
}

export function ExportButton({
    data,
    filename = "export",
    sheetName = "Sheet1",
    variant = "outline",
    className = "",
    label = "Exporter Excel"
}: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert("Aucune donnée à exporter")
            return
        }

        // Convert data to worksheet
        const ws = utils.json_to_sheet(data)

        // Create workbook
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, sheetName)

        // Save file
        writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    return (
        <Button
            variant={variant}
            className={className}
            onClick={handleExport}
        >
            <Download className="mr-2 h-4 w-4" />
            {label}
        </Button>
    )
}
