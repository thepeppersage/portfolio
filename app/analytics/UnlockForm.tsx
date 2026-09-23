"use client";

import { useActionState } from "react";
import { unlockAnalytics } from "./actions";

export function UnlockForm() {
  const [state, action, pending] = useActionState(unlockAnalytics, null);

  return (
    <form action={action} className="mt-16 max-w-md">
      <label
        htmlFor="analytics-password"
        className="font-sans text-base text-black/45"
      >
        Password
      </label>
      <div className="mt-3 border-t border-black/20" />
      <input
        id="analytics-password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        className="mt-6 w-full border-0 border-b border-black/20 bg-transparent py-2 font-sans text-lg outline-none focus:border-black"
      />
      {state?.error ? (
        <p className="mt-3 font-sans text-sm text-black/55">Wrong password.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="link-underline mt-8 font-mono text-sm uppercase tracking-wider text-black/70 disabled:opacity-50"
      >
        {pending ? "Checking…" : "[ enter ]"}
      </button>
    </form>
  );
}
