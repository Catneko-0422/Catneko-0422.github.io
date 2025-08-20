import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const { password } = await req.json().catch(() => ({}));
    if (!password) return NextResponse.json({ ok: false, error: "Missing password" }, { status: 400 });

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
        return NextResponse.json({ ok: false, error: "Missing ADMIN_PASSWORD" }, { status: 500 });
    }

    if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    // 設定 HttpOnly Cookie（7天）
    res.cookies.set("admin", "1", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
    return res;
}
