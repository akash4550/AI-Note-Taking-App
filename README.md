# 🧠 AI Note-Taking App

A high-performance, full-stack, AI-powered note-taking application designed to streamline the writing process. Built with Next.js 14, Hono.js, PostgreSQL (Neon), Clerk authentication, and Google Gemini AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akash4550/AI-Note-Taking-App)

**🚀 Live Demo:** [https://ai-note-taking-app-six.vercel.app/](https://ai-note-taking-app-six.vercel.app/)  
**💻 Repository:** [https://github.com/akash4550/AI-Note-Taking-App](https://github.com/akash4550/AI-Note-Taking-App)  

---

## ✨ Features

* **Secure Authentication:** Powered by Clerk (sign up, sign in, protected routes, and user profile management).
* **Rich Text Editor:** Built using Tiptap for a smooth, reliable, and highly customizable writing experience.
* **AI-Powered Tools (Google Gemini):**
    * **Summarize:** Instantly generate concise summaries of your note content.
    * **Grammar & Spelling:** Automatically proofread and fix grammatical errors.
    * **Auto-Tagging:** Generate contextually relevant tags based on the note's content.
* **Smart Organization:** Fast, responsive search by note title and filtering via tags.
* **Modern UI/UX:** Crafted with shadcn/ui, Tailwind CSS, Lucide Icons, and seamless dark/light theme toggling.
* **Robust Backend:** Custom API layer built with Hono.js ensuring fast route handling and a clean Smart/Dumb component architecture.

---

## 🛠 Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18
* **API Layer:** Hono.js (mounted via a catch-all Next.js route)
* **Database:** PostgreSQL (Neon DB) + Drizzle ORM
* **Authentication:** Clerk
* **AI Provider:** Google Gemini API (`@google/generative-ai`)
* **Styling & UI:** Tailwind CSS, Radix UI, shadcn/ui
* **Validation:** Zod

---

## 🗂 Project Structure

```text
src/
├── app/                    # Next.js App Router (Frontend)
│   ├── api/               # Hono.js API catch-all ([[...route]]/route.ts)
│   ├── notes/             # Main application interface
│   └── layout.tsx         # Root layout & providers
├── components/            # React UI components
│   ├── ui/               # shadcn/ui primitives
│   ├── NoteEditor.tsx    # Tiptap rich text editor core
│   └── AISidebar.tsx     # Gemini AI feature controls
├── db/                    # Database Configuration
│   ├── schema.ts         # Drizzle schema definitions
│   └── index.ts          # DB connection instance
├── lib/                   # Utilities & Services
│   ├── ai-service.ts     # Google Gemini SDK integration
│   └── utils.ts          # Tailwind merge & helper functions
└── server/                # Backend Logic
    ├── app.ts            # Hono application setup
    └── routes/           # RESTful API route handlers
        └── notes.ts      # Notes CRUD & AI endpoints
Getting Started (Local Development)1. Clone & InstallBashgit clone [https://github.com/akash4550/AI-Note-Taking-App.git](https://github.com/akash4550/AI-Note-Taking-App.git)
cd AI-Note-Taking-App
npm install
2. Configure Environment VariablesCreate a .env.local file in the project root. Never commit this file.Code snippet# Clerk Authentication
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
3. Database SetupGenerate and push the database schema to your Neon PostgreSQL instance:Bashnpm run db:generate
npm run db:push
4. Run the Development ServerBashnpm run dev
Navigate to http://localhost:3000 to view the application.🔌 API EndpointsThe API is managed by Hono and prefixed with /api/notes. Authentication is enforced via Clerk, which injects the x-user-id header securely.MethodEndpointDescriptionGET/api/notesFetch all notes for the authenticated userGET/api/notes/:idRetrieve a specific notePOST/api/notesCreate a new notePATCH/api/notes/:idUpdate note content/tags/titleDELETE/api/notes/:idDelete a notePOST/api/notes/ai/summarizeGenerate a summary via GeminiPOST/api/notes/ai/fix-grammarCorrect grammar and spellingPOST/api/notes/ai/auto-tagAuto-generate contextual tags☁️ Deployment Notes (Vercel)This application is fully optimized for Vercel deployment.Critical Configuration:The API route at src/app/api/[[...route]]/route.ts is explicitly set to the Node.js runtime to support the postgres driver, which is incompatible with Vercel's Edge runtime.TypeScriptexport const runtime = "nodejs";
Ensure all environment variables from .env.local are perfectly mirrored in your Vercel Project Settings prior to deployment.🧑‍💻 AuthorAkshay LakwalGitHub: @akash4550
