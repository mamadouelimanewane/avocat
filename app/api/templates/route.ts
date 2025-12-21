
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, content, variables } = body;

        const template = await prisma.template.create({
            data: {
                name,
                category,
                content,
                variables
            },
        });

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating template' }, { status: 500 });
    }
}
