import { DeadlineCalculator } from "@/components/tools/DeadlineCalculator"
import { LegalLibrary } from "@/components/tools/LegalLibrary"
import { LexScanner } from "@/components/tools/LexScanner"
import { QuantumSimulator } from "@/components/tools/QuantumSimulator"
import { ConflictChecker } from "@/components/tools/ConflictChecker"
import { JudgeProfiler } from "@/components/ai/JudgeProfiler"
import { SherlockScanner } from "@/components/tools/SherlockScanner"
import { ExecutionCommander } from "@/components/tools/ExecutionCommander"

import { NexusGraph } from "@/components/ai/NexusGraph"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Clock, BookOpen, ScanSearch, ShieldAlert, Network, Gavel, Eye, Crosshair } from "lucide-react"




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
                <TabsList className="grid w-full grid-cols-6 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="deadlines" className="gap-2">
                        <Clock className="h-4 w-4" /> Délais
                    </TabsTrigger>
                    <TabsTrigger value="indemnity" className="gap-2">
                        <Calculator className="h-4 w-4" /> Indemnités
                    </TabsTrigger>
                    <TabsTrigger value="conflicts" className="gap-2">
                        <ShieldAlert className="h-4 w-4" /> Conflits
                    </TabsTrigger>
                    <TabsTrigger value="nexus" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                        <Network className="h-4 w-4" /> Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="judges" className="gap-2 data-[state=active]:bg-indigo-900 data-[state=active]:text-white">
                        <Gavel className="h-4 w-4" /> Magistrats
                    </TabsTrigger>
                    <TabsTrigger value="sherlock" className="gap-2 data-[state=active]:bg-rose-950 data-[state=active]:text-white">
                        <Eye className="h-4 w-4" /> Sherlock
                    </TabsTrigger>
                    <TabsTrigger value="commander" className="gap-2 data-[state=active]:bg-emerald-950 data-[state=active]:text-white">
                        <Crosshair className="h-4 w-4" /> Commander
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
                    <QuantumSimulator />
                </TabsContent>


                <TabsContent value="conflicts" className="mt-6">
                    <ConflictChecker />
                </TabsContent>

                <TabsContent value="nexus" className="mt-6">
                    <NexusGraph />
                </TabsContent>

                <TabsContent value="judges" className="mt-6">
                    <JudgeProfiler />
                </TabsContent>

                <TabsContent value="sherlock" className="mt-6">
                    <SherlockScanner />
                </TabsContent>

                <TabsContent value="commander" className="mt-6">
                    <ExecutionCommander />
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
