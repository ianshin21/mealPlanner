import { NextRequest, NextResponse } from "next/server";
import { generateMealPlan } from "@/lib/meal-generator";
import type { GenerateRequest } from "@/lib/types";

export const runtime = "edge";

function nanoid(len = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  for (const byte of arr) id += chars[byte % chars.length];
  return id;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { userInput } = body;

    if (!userInput) {
      return NextResponse.json({ success: false, error: "입력값이 없습니다." }, { status: 400 });
    }

    const sessionId = nanoid();
    const plan = generateMealPlan(userInput, sessionId);

    return NextResponse.json({ success: true, plan });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "식단 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
