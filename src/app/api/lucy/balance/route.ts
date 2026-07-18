import { NextResponse } from "next/server";

import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyBalance } from "@/lib/lucy/wallet";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const balance = await getLucyBalance(userId);
  return NextResponse.json({ balance });
}
