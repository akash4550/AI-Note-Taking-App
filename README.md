## AI Note-Taking App

A full‑stack, AI‑powered note‑taking application built with Next.js 14 (App Router), Clerk authentication, Neon + Drizzle ORM, and Google Gemini for summarisation, grammar fixes, and auto‑tagging.

### Features

- **Authentication** via Clerk (sign up / sign in / protected notes area).
- **Notes CRUD**: create, view, update, delete notes per user.
- **Search & tags** for quick filtering.
- **Rich text editor** using TipTap.
- **AI tools** (Google Gemini):
  - Summarise note content.
  - Fix grammar & spelling.
  - Auto‑generate relevant tags.

### Tech Stack

- **Framework**: Next.js 14 (App Router, `app/` directory).
- **UI**: React 18, Tailwind CSS, Radix UI.
- **Auth**: Clerk.
- **Database**: Neon PostgreSQL + Drizzle ORM (`postgres` driver).
- **AI**: Google Gemini via `@google/generative-ai`.

---

### Getting Started (Local)

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env.local` in the project root**

Use your own credentials; do **not** commit this file.

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_postgres_connection_string

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

3. **Run database migrations (optional if schema already exists)**

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:migrate
```

4. **Start the dev server**

```bash
npm run dev
```

Then open `http://localhost:3000`.

---

### Running in Production / Vercel

On Vercel, you must configure the same environment variables in **Project → Settings → Environment Variables**:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `DATABASE_URL`
- `GOOGLE_GEMINI_API_KEY`

The catch‑all API route at `src/app/api/[[...route]]/route.ts` is explicitly configured to run in the Node.js runtime:

```12:18:src/app/api/[[...route]]/route.ts
export const runtime = "nodejs";
```

This is required because the backend uses the `postgres` driver and stream handling that are not supported on the Edge runtime.

To build locally:

```bash
npm run build
npm start
```

---

### How Notes and AI Work

- **Notes API** is implemented with Hono in `src/server/routes/notes.ts` and mounted under `/api/notes`.
- Each request is authenticated via Clerk in `src/app/api/[[...route]]/route.ts`, which forwards the request into the Hono app and injects the `x-user-id` header.
- The **Notes page** (`src/app/notes/page.tsx`) fetches notes from `/api/notes` and renders:
  - A sidebar with all notes.
  - A `NoteEditor` for the currently selected note.
- The **AI sidebar** (`src/components/AISidebar.tsx`) calls:
  - `POST /api/notes/ai/summarize`
  - `POST /api/notes/ai/fix-grammar`
  - `POST /api/notes/ai/auto-tag`
  which are backed by `src/lib/ai-service.ts` (Google Gemini).

---

### Known Implementation Details / Fixes

- **Switching between notes**: the `NoteEditor` component is keyed by the selected note ID:

```210:224:src/app/notes/page.tsx
{selectedNote ? (
  <NoteEditor
    key={selectedNote.id}
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
) : (/* empty state */)}
```

This ensures that when you click a different note in the sidebar, the editor fully remounts with that note’s title and content (fixing the issue where the editor stayed on the previous note).

- **AI model**: the app uses a current Gemini model:

```28:36:src/lib/ai-service.ts
class AIService {
  private get model() {
    return getGenAI().getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { temperature: 0.2 },
    });
  }
}
```

If the model name becomes outdated in the future, update it here according to the latest Google Gemini documentation.

---

### Scripts

- `npm run dev` – start dev server.
- `npm run build` – production build.
- `npm start` – run built app.
- `npm run lint` – run ESLint.
- `npm run db:generate` – generate Drizzle migrations.
- `npm run db:migrate` – apply migrations.
- `npm run db:push` – push schema directly to DB.
- `npm run db:studio` – open Drizzle Studio.

---

### Troubleshooting

- **Notes don’t change when clicking in sidebar**
  - Ensure you’re on a version where `NoteEditor` is keyed by `selectedNote.id` as shown above.

- **AI errors / no response**
  - Confirm `GOOGLE_GEMINI_API_KEY` is set and valid.
  - Check browser toasts for detailed error messages coming from the backend.

- **Auth issues**
  - Verify all Clerk env vars are correctly configured in Vercel and locally.

If you hit a specific error, copy the stack trace or message and debug starting from the referenced file and line.

# AI Note-Taking App

A high-performance AI-powered note-taking application built with Next.js 14, Hono.js, PostgreSQL (Neon), Clerk authentication, and Google Gemini AI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **API**: Hono.js (via catch-all route)
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **UI**: shadcn/ui + Tailwind CSS + Lucide Icons
- **AI**: Google Gemini API
- **Validation**: Zod
- **Rich Text Editor**: Tiptap

## Features

- ✅ Type-safe database operations with Drizzle ORM
- ✅ Secure authentication with Clerk
- ✅ User profile page
- ✅ Rich text editing with Tiptap
- ✅ AI-powered features:
  - Summarize notes
  - Fix grammar and spelling
  - Auto-generate tags
- ✅ Search notes by title
- ✅ Delete notes (with confirmation)
- ✅ Dark/light theme toggle
- ✅ Clean component architecture (Smart/Dumb pattern)
- ✅ Production-ready code with zero `any` types

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Hono catch-all)
│   ├── notes/             # Notes page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── NoteEditor.tsx    # Main editor component
│   └── AISidebar.tsx     # AI features sidebar
├── db/                    # Database
│   ├── schema.ts         # Drizzle schema
│   └── index.ts          # DB connection
├── lib/                   # Utilities
│   ├── ai-service.ts     # Google Gemini integration
│   └── utils.ts          # Helper functions
└── server/                # Hono.js API
    ├── app.ts            # Hono app setup
    └── routes/           # API route handlers
        └── notes.ts      # Notes API routes
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local.example` to `.env.local` and fill in:
   - Clerk credentials
   - Neon PostgreSQL connection string
   - Google Gemini API key

3. **Run database migrations**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Database Schema

The `notes` table includes:
- `id`: Unique identifier (CUID)
- `userId`: Clerk user ID
- `title`: Note title
- `content`: Rich text content (HTML)
- `tags`: Array of tag strings
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

All endpoints are prefixed with `/api/notes`:

- `GET /api/notes` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/ai/summarize` - Summarize content
- `POST /api/notes/ai/fix-grammar` - Fix grammar
- `POST /api/notes/ai/auto-tag` - Generate tags

## Deployment

This app is ready for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app uses Next.js App Router and is fully compatible with Vercel's serverless functions.

## Development

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
