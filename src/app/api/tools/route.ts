// src/app/api/tools/route.ts
import { NextResponse } from "next/server";
import { createClient, type RedisClientType } from "redis";
import type { ToolsTree } from "@/types/tools";

// 必須用 Node.js runtime（Redis TCP 連線不支援 Edge）
export const runtime = "nodejs";
// 避免快取，確保每次都是最新資料
export const dynamic = "force-dynamic";

const KEY = "tools:tree";

/** 在 Serverless 環境做 client 單例，避免每次重連 */
let _clientPromise: Promise<RedisClientType> | null = null;

function getRedis(): Promise<RedisClientType> {
    if (_clientPromise) return _clientPromise;

    const url = process.env.REDIS_URL;
    if (!url) throw new Error("Missing REDIS_URL");

    const client = createClient({ url });
    client.on("error", (err) => console.error("[Redis] error:", err));

    _clientPromise = client.connect().then(() => client as RedisClientType);
    return _clientPromise;
}

export async function GET() {
    try {
        const redis = await getRedis();
        const raw = await redis.get(KEY); // string | null
        const data: ToolsTree = raw ? JSON.parse(raw) : [];
        return NextResponse.json(data);
    } catch (err) {
        console.error("GET /api/tools error:", err);
        // 失敗也回空陣列，前端不會炸
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ToolsTree;
        if (!Array.isArray(body)) {
            return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
        }

        const redis = await getRedis();
        await redis.set(KEY, JSON.stringify(body));
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("POST /api/tools error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
