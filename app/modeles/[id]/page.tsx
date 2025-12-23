
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

    // Ensure types match (category can be null in DB but Editor expects string)
    const tplData = {
        ...template,
        category: template.category || '',
        variables: template.variables || ''
    }

    return (
        <TemplateEditor initialData={tplData} />
    )
}
