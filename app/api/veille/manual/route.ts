import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { maxPerSource } = await request.json();

        console.log('🎯 Scan manuel déclenché...');

        // En production : exécuter runManualCycle() du veille-service
        // Pour l'instant : simulation
        const totalImported = Math.floor(Math.random() * 5);

        return NextResponse.json({
            success: true,
            totalImported,
            totalFound: maxPerSource * 5
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Erreur scan' },
            { status: 500 }
        );
    }
}
