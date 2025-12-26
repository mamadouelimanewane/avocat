
import { getLedgerEntries } from "@/app/actions"
import { GrandLivreList } from "@/components/comptabilite/GrandLivreList"

export default async function GrandLivrePage() {
    const entries = await getLedgerEntries()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Grand Livre
                </h1>
            </div>

            <GrandLivreList entries={entries as any} />
        </div>
    )
}
