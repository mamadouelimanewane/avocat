
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";

export const MobileSidebar = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children || (
                    <button className="md:hidden pr-4 hover:opacity-75 transition">
                        <Menu className="h-6 w-6 text-slate-700" />
                    </button>
                )}
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white border-r border-slate-200 w-72">
                <Sidebar className="relative h-full w-full border-none shadow-none" />
            </SheetContent>
        </Sheet>
    );
};
