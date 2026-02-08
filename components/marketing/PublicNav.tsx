
"use client"

import Link from 'next/link';
import { Scale, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PublicNav() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/expertise', label: 'Expertise' },
        { href: '/lex-ai', label: 'LexAI' },
        { href: '/tarifs', label: 'Plans CFA' },
        { href: '/about', label: 'À Propos' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                <Scale className="h-6 w-6 text-amber-500" />
                <span>LEX<span className="text-amber-500">PREMIUM</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "transition-colors hover:text-white",
                            pathname === link.href ? "text-amber-500" : "text-slate-400"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 border-none shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        Connexion
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
