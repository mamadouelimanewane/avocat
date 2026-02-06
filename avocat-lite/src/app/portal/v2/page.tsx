"use client"

import { PortalV2 } from '@/components/portal/PortalV2'

export default function PortalTestPage() {
    // Données de test
    const mockClientData = {
        id: 'client-123',
        name: 'Amadou Ba',
        facturesImpayees: [
            {
                id: 'fact-001',
                number: 'FAC-2024-123',
                amount: 250000,
                reference: 'REF-DOSS-456'
            },
            {
                id: 'fact-002',
                number: 'FAC-2024-145',
                amount: 150000,
                reference: 'REF-DOSS-789'
            }
        ]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        🚀 Portail Client V2.0
                    </h1>
                    <p className="text-slate-600">
                        Module de communication avancée - Chat • Upload • Paiement Mobile Money
                    </p>
                    <div className="mt-4 inline-flex gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                            ✅ Chat Live
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                            ✅ Upload Documents
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
                            ✅ Mobile Money
                        </span>
                    </div>
                </div>

                {/* Portal Component */}
                <PortalV2
                    clientData={mockClientData}
                    dossierId="dossier-test-123"
                />

                {/* Info Card */}
                <div className="mt-8 p-6 bg-white rounded-lg border-2 border-dashed border-blue-200">
                    <h3 className="font-semibold text-slate-900 mb-2">ℹ️ Mode Démonstration</h3>
                    <p className="text-sm text-slate-600 mb-3">
                        Cette page est un environnement de test pour le nouveau module Portail Client V2.
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                        <li><strong>Chat:</strong> Réponses automatiques simulées (2 sec de délai)</li>
                        <li><strong>Upload:</strong> Simulation de progression (fichiers stockés temporairement)</li>
                        <li><strong>Paiement:</strong> Mode simulation - Orange Money, Wave et Free Money</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
