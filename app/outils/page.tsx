import { DeadlineCalculator } from "@/components/tools/DeadlineCalculator"
import { LegalLibrary } from "@/components/tools/LegalLibrary"
import { LexScanner } from "@/components/tools/LexScanner"
import { IndemnityCalculator } from "@/components/tools/IndemnityCalculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Clock, BookOpen, ScanSearch } from "lucide-react"

export default function ToolsPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Outils & Ressources</h1>
                    <p className="text-slate-500 mt-1">Utilitaires juridiques et documentation OHADA/Sénégal.</p>
                </div>
            </div>

            <Tabs defaultValue="deadlines" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="deadlines" className="gap-2">
                        <Clock className="h-4 w-4" /> Délais
                    </TabsTrigger>
                    <TabsTrigger value="indemnity" className="gap-2">
                        <Calculator className="h-4 w-4" /> Indemnités
                    </TabsTrigger>
                    <TabsTrigger value="scanner" className="gap-2">
                        <ScanSearch className="h-4 w-4" /> Scanner
                    </TabsTrigger>
                    <TabsTrigger value="library" className="gap-2">
                        <BookOpen className="h-4 w-4" /> Bibliothèque
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="deadlines" className="mt-6">
                    <DeadlineCalculator />
                </TabsContent>

                <TabsContent value="indemnity" className="mt-6">
                    <IndemnityCalculator />
                </TabsContent>

                <TabsContent value="scanner" className="mt-6">
                    <LexScanner />
                </TabsContent>

                <TabsContent value="library" className="mt-6">
                    <LegalLibrary />
                </TabsContent>
            </Tabs>
        </div>
    )
}
