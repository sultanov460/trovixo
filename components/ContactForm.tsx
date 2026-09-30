"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="card p-6 text-sm text-ink">Thanks — your message was sent successfully.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Name</label>
        <input id="name" name="name" autoComplete="name" maxLength={100} required className="w-full rounded-card border border-ink/20 bg-paper px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required className="w-full rounded-card border border-ink/20 bg-paper px-4 py-2.5 text-sm" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea id="message" name="message" required maxLength={5000} rows={5} className="w-full rounded-card border border-ink/20 bg-paper px-4 py-2.5 text-sm" />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-50">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && <p role="alert" className="text-sm text-clay-dark">{errorMessage}</p>}
    </form>
  );
}
