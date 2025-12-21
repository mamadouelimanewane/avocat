
"use client"

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function ArchiveSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        if (query) {
            params.set('q', query)
        } else {
            params.delete('q')
        }
        router.push(`/archives?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Mots-clés, boîtes, dossiers..."
                    className="pl-9 bg-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Filtres Avancés</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Tous les types</option>
                    <option>Actes</option>
                    <option>Correspondances</option>
                </select>
                <div className="flex gap-2">
                    <Input type="date" className="bg-white text-xs" />
                    <Input type="date" className="bg-white text-xs" />
                </div>
            </div>

            <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" /> Rechercher
            </Button>

            <Button variant="outline" type="button" className="w-full text-xs" onClick={() => {
                setQuery('')
                router.push('/archives')
            }}>
                Réinitialiser
            </Button>
        </form>
    )
}
