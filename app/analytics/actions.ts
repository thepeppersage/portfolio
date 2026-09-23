"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "analytics_ok";
const PASSWORD = "wang";

function passwordsMatch(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAnalyticsUnlocked() {
  const store = await cookies();
  return store.get(COOKIE)?.value === "1";
}

export async function unlockAnalytics(
  _prev: { error: boolean } | null,
  formData: FormData,
) {
  const password = String(formData.get("password") ?? "");
  if (!passwordsMatch(password, PASSWORD)) {
    return { error: true };
  }

  const store = await cookies();
  store.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/analytics",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/analytics");
}
