'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Pin, Trash2, Edit2, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteNote } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";

interface NoteCardProps {
    note: any;
}

export function NoteCard({ note }: NoteCardProps) {
    const { toast } = useToast();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleDelete = async () => {
        if (confirm("Supprimer cette note ?")) {
            await deleteNote(note.id);
            toast({ title: "Note supprimée." });
        }
    };

    const toggleAudio = () => {
        if (!audioRef.current && note.audioContent) {
            audioRef.current = new Audio(note.audioContent);
            audioRef.current.onended = () => setIsPlaying(false);
        }

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const colors: { [key: string]: string } = {
        blue: "bg-blue-50 border-blue-100 text-blue-900",
        green: "bg-green-50 border-green-100 text-green-900",
        yellow: "bg-yellow-50 border-yellow-100 text-yellow-900",
        red: "bg-red-50 border-red-100 text-red-900",
        purple: "bg-purple-50 border-purple-100 text-purple-900",
    };

    return (
        <Card className={`relative transition-all hover:shadow-md ${colors[note.color] || colors.blue}`}>
            {note.isPinned && (
                <div className="absolute top-2 right-2 text-amber-500">
                    <Pin className="h-4 w-4 fill-current" />
                </div>
            )}
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold line-clamp-1 pr-6">
                    {note.title}
                </CardTitle>
                <div className="text-xs opacity-70">
                    {new Date(note.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {note.type === 'AUDIO' ? (
                    <div className="p-4 bg-white/50 rounded-lg flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 rounded-full shrink-0 shadow-sm bg-white"
                            onClick={toggleAudio}
                        >
                            {isPlaying ? <Pause className="h-4 w-4 text-slate-900" /> : <Play className="h-4 w-4 ml-0.5 text-slate-900" />}
                        </Button>
                        <div className="flex-1">
                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full bg-slate-900 transition-all duration-300 ${isPlaying ? 'w-full animate-[progress_10s_linear]' : 'w-0'}`} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Mémo Vocal</p>
                        </div>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed line-clamp-6">
                        {note.content}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2 border-t border-black/5">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-black/40 hover:text-red-500 hover:bg-black/5" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
