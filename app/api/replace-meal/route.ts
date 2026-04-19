import { NextRequest, NextResponse } from "next/server";
import { replaceOneMeal } from "@/lib/meal-generator";
import type { ReplaceMealRequest } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body: ReplaceMealRequest = await req.json();
    const { day, mealType, userInput, currentPlan } = body;

    if (!day || !mealType || !userInput) {
      return NextResponse.json({ success: false, error: "입력값이 없습니다." }, { status: 400 });
    }

    const replaceSeed = Date.now() + day * 100 + (mealType === "lunch" ? 0 : 50);
    const newMeal = replaceOneMeal(userInput, currentPlan, day, mealType, replaceSeed);

    return NextResponse.json({ success: true, newMeal });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "식단 교체 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
