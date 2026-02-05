import { getMails, getMailWorkflows, getWorkflowStats } from '@/app/actions'
import CourrierDashboard from '@/components/courrier/CourrierDashboard'

export const dynamic = 'force-dynamic'

export default async function CourrierPage() {
    const [mails, workflows, stats] = await Promise.all([
        getMails(),
        getMailWorkflows(),
        getWorkflowStats()
    ])

    return (
        <div className="max-w-[1600px] mx-auto p-4 sm:p-8">
            <CourrierDashboard
                mails={mails}
                workflows={workflows}
                stats={stats}
            />
        </div>
    )
}
