export const runtime = "nodejs";

import { auth } from "@clerk/nextjs/server";
import app from "@/server/app";
import { NextRequest } from "next/server";

async function handleRequest(
  req: NextRequest,
  method: string
) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const headers = new Headers(req.headers);
  headers.set("x-user-id", userId);

  // FIX: Added 'duplex: "half"' and conditional body handling
  const modifiedReq = new Request(req.url, {
    method,
    headers,
    // Ensure body is only sent for non-GET requests
    body: method !== "GET" && method !== "HEAD" ? req.body : null,
    // @ts-ignore - Explicitly required for Node.js fetch with streams
    duplex: "half", 
  });

  return app.fetch(modifiedReq);
}
export async function GET(
  req: NextRequest,
  { params: _params }: { params: { route: string[] } }
) {
  return handleRequest(req, "GET");
}

export async function POST(
  req: NextRequest,
  { params: _params }: { params: { route: string[] } }
) {
  return handleRequest(req, "POST");
}

export async function PATCH(
  req: NextRequest,
  { params: _params }: { params: { route: string[] } }
) {
  return handleRequest(req, "PATCH");
}

export async function DELETE(
  req: NextRequest,
  { params: _params }: { params: { route: string[] } }
) {
  return handleRequest(req, "DELETE");
}
