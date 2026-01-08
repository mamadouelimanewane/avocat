import { NextResponse } from 'next/server';

export async function POST() {
    try {
        console.log('⏸️  Veille arrêtée');

        return NextResponse.json({
            success: true,
            message: 'Veille juridique arrêtée'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Erreur' },
            { status: 500 }
        );
    }
}
