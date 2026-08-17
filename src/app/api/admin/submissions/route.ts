import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getContactSubmissions,
  updateContactSubmission,
  deleteContactSubmission,
} from "@/lib/db";
import { recordAdminActivity } from "@/lib/analytics-db";

const ALLOWED_STATUSES = ["unread", "read", "replied", "archived"] as const;

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await getContactSubmissions();
  return NextResponse.json({ submissions });
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateContactSubmission(id, {
      status,
      archived: status === "archived",
      read: status === "read" || status === "replied",
    });

    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    if (status === "archived") {
      await recordAdminActivity({
        type: "submission_archived",
        description: `Archived inquiry from ${updated.name}`,
        targetId: id,
        targetTitle: updated.subject,
        actor,
      });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const deleted = await deleteContactSubmission(id);
    if (!deleted) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "submission_deleted",
      description: `Deleted inquiry ${id}`,
      targetId: id,
      actor,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
