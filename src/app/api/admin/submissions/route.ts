import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/writeClient";
import * as Sentry from "@sentry/nextjs";

async function verifySubmission(id: string): Promise<boolean> {
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
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!(await verifySubmission(id))) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
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
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!(await verifySubmission(id))) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
