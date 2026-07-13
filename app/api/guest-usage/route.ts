import { NextResponse } from "next/server";
import { getClientIp } from "@/app/lib/rate-limit";
import { checkAndRecordGuestUsage } from "@/app/lib/guest-usage-server";
import { TOOL_CREDIT_COSTS, type ToolKey } from "@/app/lib/credits";

const VALID_TOOLS = new Set(Object.keys(TOOL_CREDIT_COSTS));

function isToolKey(value: unknown): value is ToolKey {
  return typeof value === "string" && VALID_TOOLS.has(value);
}

// Login yapmamış ziyaretçilerin araç kullanımını IP+araç bazlı olarak
// sayan/doğrulayan endpoint - bkz. app/lib/guest-usage-server.ts. Giriş
// yapmış kullanıcılar zaten app/actions/credits.ts (server action) üzerinden
// günlük kredi sistemini kullanıyor, bu endpoint yalnızca misafirler içindir.
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const tool = body && typeof body === "object" ? (body as { tool?: unknown }).tool : null;

  if (!isToolKey(tool)) {
    return NextResponse.json({ error: "invalid_tool" }, { status: 400 });
  }

  const ip = getClientIp(request.headers);
  const result = await checkAndRecordGuestUsage(tool, ip);
  return NextResponse.json(result);
}
