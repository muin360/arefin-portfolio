import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock @/lib/auth completely without calling next-auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
  timingSafePasscodeCheck: (a?: string, b?: string) => {
    if (!a || !b || a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
    }
    return mismatch === 0;
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { POST } from "@/app/api/revalidate/route";
import { auth } from "@/lib/auth";

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.REVALIDATE_SECRET;
    delete process.env.ADMIN_SECRET;
    delete process.env.ADMIN_PASSWORD;
  });

  it("rejects unauthorized request when no session and no header provided", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const req = new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ path: "/" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("rejects request when incorrect secret header is provided", async () => {
    process.env.ADMIN_SECRET = "super-secret-key-12345";
    vi.mocked(auth).mockResolvedValue(null as any);

    const req = new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: {
        "x-revalidate-secret": "wrong-secret",
      },
      body: JSON.stringify({ path: "/" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("allows request when valid secret header is provided", async () => {
    process.env.ADMIN_SECRET = "super-secret-key-12345";
    vi.mocked(auth).mockResolvedValue(null as any);

    const req = new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: {
        "x-revalidate-secret": "super-secret-key-12345",
      },
      body: JSON.stringify({ path: "/blog" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.path).toBe("/blog");
  });

  it("allows request when valid admin session exists", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { isAdmin: true, name: "Admin" },
      expires: "9999",
    } as any);

    const req = new NextRequest("http://localhost:3000/api/revalidate", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.path).toBe("all");
  });
});
