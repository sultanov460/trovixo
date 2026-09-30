import { NextRequest, NextResponse } from "next/server";

type ContactPayload = { name?: unknown; email?: unknown; message?: unknown };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({error:"Invalid request body"}, {status:400});
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 5000);

  if (!name || !email || !message || !validEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid name, email, and message." }, { status: 400 });
  }

  // Optional server-side form endpoint (Formspree, Basin, a private webhook,
  // etc.). We deliberately do not pretend a message was delivered when no
  // real delivery service is configured. Never expose this endpoint via
  // NEXT_PUBLIC_* if it contains a secret.
  const endpoint = process.env.CONTACT_FORM_ENDPOINT?.trim();
  if (!endpoint) {
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please use the support email when it is listed on the Contact page." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, source: "Trovixo storefront" }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "We couldn't send your message right now. Please try again later." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We couldn't send your message right now. Please try again later." }, { status: 502 });
  }
}
