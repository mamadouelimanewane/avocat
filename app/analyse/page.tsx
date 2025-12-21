import { ContractAnalyzer } from "@/components/ai/ContractAnalyzer"
import { AIDrafter } from "@/components/ai/AIDrafter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, FileText, Scale, Gavel } from "lucide-react"

export default function AnalysePage() {
    return (
        <div className="h-[calc(100vh-100px)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LexAI</span>
                        Assistant
                    </h1>
                    <p className="text-slate-500 mt-1">Votre assistant juridique intelligent pour la rédaction et l'analyse.</p>
                </div>
            </div>

            <Tabs defaultValue="redaction" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mb-4 shrink-0">
                    <TabsTrigger value="redaction" className="gap-2"><FileText className="h-4 w-4" /> Rédaction d'Actes</TabsTrigger>
                    <TabsTrigger value="plaidoirie" className="gap-2"><Gavel className="h-4 w-4" /> Assistant Plaidoirie</TabsTrigger>
                    <TabsTrigger value="analyse" className="gap-2"><Scale className="h-4 w-4" /> Analyse Contractuelle</TabsTrigger>
                </TabsList>

                <TabsContent value="redaction" className="flex-1 mt-0 h-full">
                    <AIDrafter mode="DRAFTING" />
                </TabsContent>

                <TabsContent value="plaidoirie" className="flex-1 mt-0 h-full">
                    <AIDrafter mode="PLEADING" />
                </TabsContent>

                <TabsContent value="analyse" className="flex-1 mt-0 h-full">
                    <ContractAnalyzer />
                </TabsContent>
            </Tabs>
        </div>
    )
}
