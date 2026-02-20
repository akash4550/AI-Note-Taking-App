"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, Tag, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AISidebarProps {
  editor: Editor | null;
  title: string;
  content: string;
  onClose: () => void;
  onTagsGenerated: (tags: string[]) => void;
}

export function AISidebar({
  editor,
  title,
  content,
  onClose,
  onTagsGenerated,
}: AISidebarProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "No content to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading("summarize");
    try {
      const response = await fetch("/api/notes/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to summarize");
      }

      setSummary(data.summary);
      toast({
        title: "Success",
        description: "Content summarized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to summarize content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleFixGrammar = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "No content to fix",
        variant: "destructive",
      });
      return;
    }

    setIsLoading("grammar");
    try {
      const response = await fetch("/api/notes/ai/fix-grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to fix grammar");
      }

      if (editor && data.fixedContent) {
        editor.commands.setContent(data.fixedContent);
        toast({
          title: "Success",
          description: `Fixed ${data.corrections?.length || 0} issues`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fix grammar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleAutoTag = async () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Error",
        description: "Need title or content to generate tags",
        variant: "destructive",
      });
      return;
    }

    setIsLoading("tags");
    try {
      const response = await fetch("/api/notes/ai/auto-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to generate tags");
      }

      if (data.tags && data.tags.length > 0) {
        onTagsGenerated(data.tags);
        toast({
          title: "Success",
          description: `Generated ${data.tags.length} tags`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate tags",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Tools
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Summarize */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Summarize
            </CardTitle>
            <CardDescription>
              Generate a concise summary of your note
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSummarize}
              disabled={isLoading !== null}
              className="w-full"
              variant="outline"
            >
              {isLoading === "summarize" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Summarize
                </>
              )}
            </Button>
            {summary && (
              <div className="p-3 bg-muted rounded-md text-sm">
                {summary}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fix Grammar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Fix Grammar
            </CardTitle>
            <CardDescription>
              Correct grammar and spelling errors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleFixGrammar}
              disabled={isLoading !== null}
              className="w-full"
              variant="outline"
            >
              {isLoading === "grammar" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Fix Grammar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Auto Tag */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Auto Tag
            </CardTitle>
            <CardDescription>
              Automatically generate relevant tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleAutoTag}
              disabled={isLoading !== null}
              className="w-full"
              variant="outline"
            >
              {isLoading === "tags" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Tag className="h-4 w-4 mr-2" />
                  Generate Tags
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
