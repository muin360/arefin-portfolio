import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/client";

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

    const client = writeClient();
    await client.patch(id).set({ read: !!read }).commit();
    return NextResponse.json({ success: true });
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

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const client = writeClient();
    await client.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
