
import { DeadlineCalculator } from "@/components/tools/DeadlineCalculator"
import { LegalLibrary } from "@/components/tools/LegalLibrary"

export default function ToolsPage() {
    return (
        <div className="h-[calc(100vh-100px)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Outils & Ressources</h1>
                    <p className="text-slate-500 mt-1">Utilitaires juridiques et documentation OHADA/Sénégal.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
                <div className="lg:col-span-1 h-full">
                    <DeadlineCalculator />
                </div>
                <div className="lg:col-span-2 h-full">
                    <LegalLibrary />
                </div>
            </div>
        </div>
    )
}
