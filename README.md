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
