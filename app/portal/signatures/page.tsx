import { getPortalDashboardData } from '@/app/actions'
import { SignatureCenter } from '@/components/ai/SignatureCenter'
import { redirect } from 'next/navigation'

export default async function PortalSignaturesPage() {
    const { success, client } = await getPortalDashboardData()

    if (!success || !client) redirect('/portal/login')

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Signature Électronique One-Flow</h1>
                    <p className="text-indigo-200 max-w-xl">
                        Signez vos conventions d'honoraires et documents juridiques instantanément. Certifié et conforme aux normes OHADA.
                    </p>
                </div>
            </div>

            <SignatureCenter />
        </div>
    )
}
