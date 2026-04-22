"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { generateMealPlan } from "@/lib/meal-generator";
import type { UserInput } from "@/lib/types";

const TIPS = [
  "익숙한 메뉴를 우선으로 배치하고 있어요 🍱",
  "같은 재료가 연속되지 않도록 조정 중이에요 🥬",
  "조리법이 겹치지 않게 균형을 맞추고 있어요 🍳",
  "목표에 맞는 영양 구성을 확인하고 있어요 💪",
  "반찬도 골고루 배치하고 있어요 🥢",
  "거의 다 됐어요! 잠깐만요 ✨",
];

function GeneratingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get("session");
    const inputRaw = searchParams.get("input");
    if (!sessionId || !inputRaw) {
      router.replace("/generate");
      return;
    }

    let userInput: UserInput;
    try {
      userInput = JSON.parse(decodeURIComponent(inputRaw));
    } catch {
      router.replace("/generate");
      return;
    }

    // 약간의 딜레이로 로딩 화면을 자연스럽게 노출
    const timer = setTimeout(() => {
      try {
        const plan = generateMealPlan(userInput, sessionId);
        sessionStorage.setItem(`plan-${sessionId}`, JSON.stringify(plan));
        router.replace(`/result?session=${sessionId}`);
      } catch {
        router.replace("/generate?error=1");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-6">
      {/* 메인 스피너 */}
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">🍱</span>
      </div>

      {/* 타이틀 */}
      <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
        맞춤 식단을 만들고 있어요
      </h1>
      <p className="text-sm text-gray-500 mb-10 text-center">
        조건에 맞는 최적의 메뉴를 조합하고 있습니다
      </p>

      {/* 진행 팁 목록 */}
      <div className="w-full max-w-sm space-y-3">
        {TIPS.map((tip, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0 animate-pulse" />
            <span className="text-sm text-gray-600">{tip}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-10">가입 없이 무료로 생성됩니다</p>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}
