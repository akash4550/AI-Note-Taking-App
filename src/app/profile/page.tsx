"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Link href="/notes">
            <h1 className="text-lg font-semibold">AI Notes</h1>
          </Link>
          <ThemeToggle />
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>
      <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/notes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notes
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "Profile"}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div>
                <p className="text-lg font-medium">
                  {user.fullName ?? "No name"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress ?? "No email"}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">First name</span>
                <span>{user.firstName ?? "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last name</span>
                <span>{user.lastName ?? "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signed up</span>
                <span>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                To update your profile, use the{" "}
                <Link href="https://clerk.com" className="underline">
                  Clerk Dashboard
                </Link>{" "}
                or the UserButton component in the app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
