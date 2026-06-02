import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import * as Sentry from "@sentry/nextjs";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Validate that an ID belongs to a contactSubmission document.
 * Sanity auto-generated IDs are UUIDs; drafts are prefixed with "drafts.".
 * We verify the document actually exists and is the expected type before
 * allowing any mutation — preventing IDOR across document types.
 */
async function validateSubmissionId(id: string): Promise<boolean> {
  if (!id || typeof id !== "string") return false;
  // Sanity IDs are UUIDs or "drafts.<uuid>" — reject obvious garbage early.
  if (!/^(drafts\.)?[a-f0-9-]{36}$/i.test(id)) return false;
  const doc = await writeClient.fetch(
    `*[_id == $id && _type == "contactSubmission"][0]{ _id }`,
    { id },
  );
  return !!doc;
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, read } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!(await validateSubmissionId(id))) {
      Sentry.captureMessage(
        `Admin tried to patch non-submission doc: ${id} (user: ${session.user.email})`,
        "warning",
      );
      return NextResponse.json({ error: "Invalid submission" }, { status: 403 });
    }

    await writeClient.patch(id).set({ read: !!read }).commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!(await validateSubmissionId(id))) {
      Sentry.captureMessage(
        `Admin tried to delete non-submission doc: ${id} (user: ${session.user.email})`,
        "warning",
      );
      return NextResponse.json({ error: "Invalid submission" }, { status: 403 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
