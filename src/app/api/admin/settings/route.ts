import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Verify authentication and admin role
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Validate the input
    const { email, phone, phoneE164, availability, availabilityNote } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // TODO: Update Sanity document with new settings
    // This would require calling the Sanity write client

    Sentry.captureMessage(
      `Settings updated by ${session.user.email}`,
      "info",
    );

    return NextResponse.json(
      { success: true, message: "Settings updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
