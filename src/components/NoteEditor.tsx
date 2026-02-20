"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Tag, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { AISidebar } from "./AISidebar";

interface NoteEditorProps {
  noteId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave: (title: string, content: string, tags: string[]) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function NoteEditor({
  // Removed noteId from here to fix the unused variable build error
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isSaving, setIsSaving] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[500px] p-4",
        "data-placeholder": "Start typing your note...",
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const content = editor?.getHTML() || "";
      await onSave(title, content, tags);
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [title, tags, editor, onSave, toast]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex h-screen">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-bold bg-transparent border-none outline-none flex-1 mr-4"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAISidebar(!showAISidebar)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Tools
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="border-b p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              onKeyDown={handleTagInput}
              className="bg-transparent border-none outline-none text-sm"
            />
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* AI Sidebar */}
      {showAISidebar && (
        <AISidebar
          editor={editor}
          title={title}
          content={editor?.getHTML() || ""}
          onClose={() => setShowAISidebar(false)}
          onTagsGenerated={(newTags) => {
            setTags([...new Set([...tags, ...newTags])]);
          }}
        />
      )}
    </div>
  );
}