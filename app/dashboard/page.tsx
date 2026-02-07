
import MainDashboard from '@/components/dashboard/MainDashboard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
        redirect('/login');
    }

    return <MainDashboard />;
}
