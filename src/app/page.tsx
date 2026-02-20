import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LandingHeader } from "@/components/LandingHeader";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/notes");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-24">
      <LandingHeader />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">AI Note-Taking App</h1>
        <p className="text-lg mb-8">High-performance note-taking with AI assistance</p>
        <div className="flex gap-4">
          <a
            href="/sign-in"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
