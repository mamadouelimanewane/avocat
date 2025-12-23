
import { PrismaClient } from '@prisma/client'
import { TemplateEditor } from '@/components/modeles/TemplateEditor'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
    const template = await prisma.template.findUnique({
        where: { id: params.id }
    })

    if (!template) {
        notFound()
    }

    // Convert variables string back if needed, but the component handles string/array parsing?
    // Model has variables as String (JSON). Interface expects string.

    return (
        <TemplateEditor initialData={template} />
    )
}
