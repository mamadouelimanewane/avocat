import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const config = await request.json();

        // En production : démarrer le service worker
        // Pour l'instant : simulation
        console.log('🚀 Veille démarrée avec config:', config);

        return NextResponse.json({
            success: true,
            message: `Veille programmée toutes les ${config.interval}h`
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Erreur de démarrage' },
            { status: 500 }
        );
    }
}
