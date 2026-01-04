
import { cookies } from 'next/headers';
import MainDashboard from '@/components/dashboard/MainDashboard';
import LandingPage from '@/components/marketing/LandingPage';

export const dynamic = 'force-dynamic';

export default async function IndexPage() {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
        // Public view: The beautiful landing page
        return <LandingPage />;
    }

    // Authenticated view: The integrated dashboard
    return <MainDashboard />;
}
