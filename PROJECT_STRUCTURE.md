# Project Structure

## Complete File Tree

```
ai-note-taking-app/
├── .env.local.example          # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── drizzle.config.ts           # Drizzle ORM configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project documentation
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
│
└── src/
    ├── app/
    │   ├── api/
    │   │   └── [[...route]]/
    │   │       └── route.ts    # Hono.js catch-all API route
    │   ├── notes/
    │   │   ├── layout.tsx      # Notes page layout
    │   │   └── page.tsx         # Notes list and editor page
    │   ├── sign-in/
    │   │   └── [[...sign-in]]/
    │   │       └── page.tsx     # Clerk sign-in page
    │   ├── sign-up/
    │   │   └── [[...sign-up]]/
    │   │       └── page.tsx     # Clerk sign-up page
    │   ├── globals.css          # Global styles + Tiptap styles
    │   ├── layout.tsx           # Root layout with ClerkProvider
    │   └── page.tsx             # Landing page
    │
    ├── components/
    │   ├── ui/                  # shadcn/ui components
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   └── use-toast.ts
    │   ├── AISidebar.tsx        # AI features sidebar component
    │   └── NoteEditor.tsx       # Main rich text editor component
    │
    ├── db/
    │   ├── index.ts             # Drizzle database connection
    │   └── schema.ts            # Database schema (notes table)
    │
    ├── lib/
    │   ├── ai-service.ts        # Google Gemini AI service
    │   └── utils.ts             # Utility functions (cn helper)
    │
    ├── middleware.ts            # Clerk authentication middleware
    │
    └── server/
        ├── app.ts               # Hono.js app setup
        └── routes/
            └── notes.ts         # Notes API routes (CRUD + AI endpoints)
```

## Key Files Explained

### Database Schema (`src/db/schema.ts`)
- Defines the `notes` table with all required fields
- Uses Drizzle's type inference for type safety
- Exports `Note` and `NewNote` types

### API Routes (`src/server/routes/notes.ts`)
- RESTful API endpoints for notes CRUD operations
- AI endpoints: `/ai/summarize`, `/ai/fix-grammar`, `/ai/auto-tag`
- All routes protected with Clerk authentication
- Proper error handling and status codes

### AI Service (`src/lib/ai-service.ts`)
- Clean service class for Google Gemini integration
- Structured prompts that return JSON
- Three main methods: summarize, fixGrammar, autoTag

### Components
- **NoteEditor**: Main editor with Tiptap integration
- **AISidebar**: Sidebar with AI feature buttons
- **UI Components**: shadcn/ui components for consistent design

### Authentication
- Clerk middleware protects all routes except `/`, `/sign-in`, `/sign-up`
- User ID passed to API routes via headers
- Seamless integration with Hono.js

## Type Safety

✅ **Zero `any` types** - All types inferred from Drizzle schema
✅ **Strict TypeScript** - Full type checking enabled
✅ **Zod validation** - All API inputs validated
✅ **Type-safe database queries** - Drizzle ORM provides full type safety

## Architecture Patterns

1. **Smart/Dumb Components**: UI components are pure, logic in hooks/services
2. **API Layer Separation**: All backend logic in Hono.js routes
3. **Service Layer**: AI logic isolated in `ai-service.ts`
4. **Type Safety**: Types inferred from database schema
