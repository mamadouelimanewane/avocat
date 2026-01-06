import { getUserNotes } from "@/app/actions";
import { NewNoteDialog } from "@/components/notes/NewNoteDialog";
import { NoteCard } from "@/components/notes/NoteCard";
import { MessageSquare, Mic, StickyNote } from "lucide-react";

export default async function NotesPage() {
    const notes = await getUserNotes();

    return (
        <div className="space-y-8 container mx-auto py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <StickyNote className="h-8 w-8 text-amber-500" />
                        Mes Notes & Mémos
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Espace personnel pour vos notes rapides, idées et enregistrements vocaux.
                    </p>
                </div>
                <NewNoteDialog />
            </div>

            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <MessageSquare className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Aucune note</h3>
                    <p className="text-slate-500 max-w-sm text-center mt-2 mb-6">
                        Commencez par créer une nouvelle note textuelle ou un mémo vocal pour ne rien oublier.
                    </p>
                    <NewNoteDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {notes.map((note: any) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            )}
        </div>
    );
}
