
import { Card, CardContent } from "@/components/ui/card"
import { Archive, Box, FileCheck, ShieldAlert } from "lucide-react"

export function ArchiveStats({ totalBoxes, totalDocs }: { totalBoxes: number, totalDocs: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-700 dark:text-blue-300">
                        <Archive className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalDocs}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-300">Docs Archivés</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full text-amber-700 dark:text-amber-300">
                        <Box className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{totalBoxes}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-300">Boîtes Physiques</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-700 dark:text-green-300">
                        <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">100%</p>
                        <p className="text-xs text-green-600 dark:text-green-300">Intégrité</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-700 dark:text-red-300">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-100">5</p>
                        <p className="text-xs text-red-600 dark:text-red-300">Destructions 2024</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
