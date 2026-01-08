import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulation du service (en production, utiliser un vrai worker/cron)
export async function GET() {
    try {
        const count = await prisma.jurisprudence.count();

        return NextResponse.json({
            isRunning: false, // À implémenter avec Redis ou variable globale
            jurisprudenceCount: count,
            sources: 5,
            lastRun: null
        });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
