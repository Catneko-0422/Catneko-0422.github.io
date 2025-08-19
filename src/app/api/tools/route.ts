import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/tools.json");

export async function GET() {
    const data = await fs.readFile(dataPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
}

export async function POST(request: Request) {
    const body = await request.json();
    await fs.writeFile(dataPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
}