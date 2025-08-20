import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin")?.value === "1";
    return NextResponse.json({ admin: isAdmin });
}
