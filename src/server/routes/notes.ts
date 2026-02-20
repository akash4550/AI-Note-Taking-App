import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { aiService } from "@/lib/ai-service";
import type { Note } from "@/db/schema";

const notesRouter = new Hono();

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  tags: z.array(z.string()).optional(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const summarizeSchema = z.object({
  content: z.string().min(1),
});

const fixGrammarSchema = z.object({
  content: z.string().min(1),
});

const autoTagSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Helper to get userId from headers (set by Clerk middleware)
function getUserId(c: { req: { header: (name: string) => string | null | undefined } }): string {
  const userId = c.req.header("x-user-id");
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

// Error handler middleware
notesRouter.onError((err, c) => {
  if (err.message === "Unauthorized") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  console.error("Error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// GET /api/notes - Get all notes for user
notesRouter.get("/", async (c) => {
  try {
    const userId = getUserId(c);
    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(notes.updatedAt);

    return c.json({ notes: userNotes }, 200);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return c.json({ error: "Failed to fetch notes" }, 500);
  }
});

// GET /api/notes/:id - Get single note
notesRouter.get("/:id", async (c) => {
  try {
    const userId = getUserId(c);
    const noteId = c.req.param("id");

    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (!note) {
      return c.json({ error: "Note not found" }, 404);
    }

    return c.json({ note }, 200);
  } catch (error) {
    console.error("Error fetching note:", error);
    return c.json({ error: "Failed to fetch note" }, 500);
  }
});

// POST /api/notes - Create new note
notesRouter.post("/", async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();
    const validated = createNoteSchema.parse(body);

    const [newNote] = await db
      .insert(notes)
      .values({
        userId,
        title: validated.title,
        content: validated.content || "",
        tags: validated.tags || [],
      })
      .returning();

    return c.json({ note: newNote }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid request data", details: error.errors }, 400);
    }
    console.error("Error creating note:", error);
    return c.json({ error: "Failed to create note" }, 500);
  }
});

// PATCH /api/notes/:id - Update note
notesRouter.patch("/:id", async (c) => {
  try {
    const userId = getUserId(c);
    const noteId = c.req.param("id");
    const body = await c.req.json();
    const validated = updateNoteSchema.parse(body);

    // Verify note belongs to user
    const [existingNote] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (!existingNote) {
      return c.json({ error: "Note not found" }, 404);
    }

    const [updatedNote] = await db
      .update(notes)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId))
      .returning();

    return c.json({ note: updatedNote }, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid request data", details: error.errors }, 400);
    }
    console.error("Error updating note:", error);
    return c.json({ error: "Failed to update note" }, 500);
  }
});

// DELETE /api/notes/:id - Delete note
notesRouter.delete("/:id", async (c) => {
  try {
    const userId = getUserId(c);
    const noteId = c.req.param("id");

    // Verify note belongs to user
    const [existingNote] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1);

    if (!existingNote) {
      return c.json({ error: "Note not found" }, 404);
    }

    await db.delete(notes).where(eq(notes.id, noteId));

    return c.json({ message: "Note deleted successfully" }, 200);
  } catch (error) {
    console.error("Error deleting note:", error);
    return c.json({ error: "Failed to delete note" }, 500);
  }
});

// POST /api/notes/ai/summarize - AI Summarize
notesRouter.post("/ai/summarize", async (c) => {
  try {
    const body = await c.req.json();
    const validated = summarizeSchema.parse(body);

    const result = await aiService.summarize(validated.content);
    return c.json(result, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid request data", details: error.errors }, 400);
    }
    const message = error instanceof Error ? error.message : "Failed to summarize content";
    console.error("Error summarizing:", error);
    return c.json({ error: message }, 500);
  }
});

// POST /api/notes/ai/fix-grammar - AI Fix Grammar
notesRouter.post("/ai/fix-grammar", async (c) => {
  try {
    const body = await c.req.json();
    const validated = fixGrammarSchema.parse(body);

    const result = await aiService.fixGrammar(validated.content);
    return c.json(result, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid request data", details: error.errors }, 400);
    }
    const message = error instanceof Error ? error.message : "Failed to fix grammar";
    console.error("Error fixing grammar:", error);
    return c.json({ error: message }, 500);
  }
});

// POST /api/notes/ai/auto-tag - AI Auto Tag
notesRouter.post("/ai/auto-tag", async (c) => {
  try {
    const body = await c.req.json();
    const validated = autoTagSchema.parse(body);

    const result = await aiService.autoTag(validated.title, validated.content);
    return c.json(result, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid request data", details: error.errors }, 400);
    }
    const message = error instanceof Error ? error.message : "Failed to generate tags";
    console.error("Error auto-tagging:", error);
    return c.json({ error: message }, 500);
  }
});

export { notesRouter };
