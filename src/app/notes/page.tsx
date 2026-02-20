"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { NoteEditor } from "@/components/NoteEditor";
import { NoteCard } from "@/components/NoteCard";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import type { Note } from "@/db/schema";

export default function NotesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((note) =>
      note.title.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          tags: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedNote(data.note);
        setSelectedNoteId(data.note.id);
        fetchNotes();
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleSelectNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedNote(data.note);
        setSelectedNoteId(noteId);
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (selectedNoteId === noteId) {
          setSelectedNote(null);
          setSelectedNoteId(null);
        }
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSave = async (title: string, content: string, tags: string[]) => {
    if (!selectedNoteId) {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedNote(data.note);
        setSelectedNoteId(data.note.id);
        fetchNotes();
      }
    } else {
      const response = await fetch(`/api/notes/${selectedNoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedNote(data.note);
        fetchNotes();
      }
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Link href="/notes">
            <h1 className="text-lg font-semibold">AI Notes</h1>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-64 shrink-0 flex-col border-r bg-card">
          <div className="space-y-2 border-b p-4">
            <Button onClick={handleCreateNote} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes..."
            />
          </div>
          <div className="flex-1 overflow-auto p-2">
            {isLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                Loading notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                {notes.length === 0
                  ? "No notes yet. Create one to get started!"
                  : "No notes match your search."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    onSelect={() => handleSelectNote(note.id)}
                    onDelete={() => handleDeleteNote(note.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          {selectedNote ? (
            <NoteEditor
              noteId={selectedNote.id}
              initialTitle={selectedNote.title}
              initialContent={selectedNote.content}
              initialTags={selectedNote.tags}
              onSave={handleSave}
              onDelete={
                selectedNoteId
                  ? () => handleDeleteNote(selectedNoteId)
                  : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">No note selected</h2>
                <p className="mb-4 text-muted-foreground">
                  Select a note from the sidebar or create a new one
                </p>
                <Button onClick={handleCreateNote}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
