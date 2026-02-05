import { getMailDetails } from '@/app/actions'
import MailDetailContent from '@/components/courrier/MailDetailContent'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MailDetailPage({ params }: { params: { id: string } }) {
    const mail = await getMailDetails(params.id)

    if (!mail) {
        notFound()
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8">
            <MailDetailContent mail={mail} />
        </div>
    )
}
