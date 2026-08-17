import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next-auth", () => ({
  default: () => ({
    handlers: {},
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));
vi.mock("next-auth/providers/github", () => ({
  default: () => ({ id: "github" }),
}));
vi.mock("next-auth/providers/google", () => ({
  default: () => ({ id: "google" }),
}));

import { isAdmin } from "../auth";

describe("isAdmin authorization", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_EMAILS = "admin@arefin.dev,founder@arefin.dev";
    process.env.ADMIN_GITHUB_USERS = "arefin-dev,arefin-admin";
  });

  afterEach(() => {
    process.env.ADMIN_EMAILS = originalEnv.ADMIN_EMAILS;
    process.env.ADMIN_GITHUB_USERS = originalEnv.ADMIN_GITHUB_USERS;
  });

  it("authorizes listed admin emails", () => {
    expect(isAdmin("admin@arefin.dev", null)).toBe(true);
    expect(isAdmin("founder@arefin.dev", null)).toBe(true);
  });

  it("authorizes listed github logins", () => {
    expect(isAdmin(null, "arefin-dev")).toBe(true);
    expect(isAdmin(null, "arefin-admin")).toBe(true);
  });

  it("rejects non-admin emails and logins", () => {
    expect(isAdmin("user@example.com", null)).toBe(false);
    expect(isAdmin(null, "random-user")).toBe(false);
    expect(isAdmin(null, null)).toBe(false);
  });
});

