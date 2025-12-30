
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const boxes = await prisma.archiveBox.findMany({
            orderBy: { code: 'asc' }
        })
        return NextResponse.json(boxes)
    } catch (e) {
        return NextResponse.json([], { status: 500 })
    }
}
