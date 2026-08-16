import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { writeClient } from "@/sanity/client";
import { revalidateTag } from "next/cache";

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

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    }

    // Persist settings if Sanity write token is configured
    if (process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const client = writeClient();
        await client
          .patch("siteConfig")
          .set({
            email,
            phone: phone || "",
            phoneE164: phoneE164 || "",
            availability: availability || "available",
            availabilityNote: availabilityNote || "",
          })
          .commit();
        revalidateTag("siteConfig", "default");
      } catch (sanityErr) {
        Sentry.captureException(sanityErr);
      }
    }

    Sentry.captureMessage(
      `Settings updated by ${session.user.email ?? "admin"}: ${JSON.stringify({ email, phone, phoneE164, availability, availabilityNote })}`,
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
