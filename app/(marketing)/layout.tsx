


import { PublicNav } from '@/components/marketing/PublicNav';
import { PublicFooter } from '@/components/marketing/PublicFooter';
import { LexPublicChatWidget } from '@/components/public/LexPublicChatWidget';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-amber-500/30">
            <PublicNav />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
            <LexPublicChatWidget />
        </div>
    );
}
