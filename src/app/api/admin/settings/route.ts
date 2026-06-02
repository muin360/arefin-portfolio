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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, phone, phoneE164, availability, availabilityNote } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find existing siteConfig document
    const existing = await writeClient.fetch(
      `*[_type == "siteConfig"][0]{ _id }`
    );

    if (existing?._id) {
      // Update existing
      await writeClient
        .patch(existing._id)
        .set({ email, phone, phoneE164, availability, availabilityNote })
        .commit();
    } else {
      // Create new siteConfig if none exists
      await writeClient.create({
        _type: "siteConfig",
        email,
        phone,
        phoneE164,
        availability,
        availabilityNote,
      });
    }

    Sentry.captureMessage(
      `Settings updated by ${session.user.email}`,
      "info"
    );

    return NextResponse.json(
      { success: true, message: "Settings updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
