import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

type Body = {
  tag?: string;
  path?: string;
};

function getSecretFromRequest(req: NextRequest): string | null {
  return req.headers.get("x-revalidate-secret") ?? req.nextUrl.searchParams.get("secret");
}

export async function POST(req: NextRequest) {
  if (!env.wpRevalidateSecret) {
    return NextResponse.json(
      { ok: false, message: "WP_REVALIDATE_SECRET is not configured." },
      { status: 404 }
    );
  }

  const incomingSecret = getSecretFromRequest(req);
  if (incomingSecret !== env.wpRevalidateSecret) {
    return NextResponse.json({ ok: false, message: "Invalid secret." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.tag) revalidateTag(body.tag);
  if (body.path) revalidatePath(body.path);

  if (!body.tag && !body.path) {
    return NextResponse.json(
      { ok: false, message: "Provide `tag` and/or `path` in request body." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, revalidated: body });
}
