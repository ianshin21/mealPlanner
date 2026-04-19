"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DayPlanCard from "@/components/meal/DayPlanCard";
import AdBanner from "@/components/ads/AdBanner";
import type { MealPlan, DayPlan, MealSlot, MealType } from "@/lib/types";

const GOAL_LABELS: Record<string, string> = {
  "light-loss": "가볍게 감량",
  balanced: "균형 건강관리",
  "high-protein": "단백질 챙기기",
};

const STYLE_LABELS: Record<string, string> = {
  korean: "한식 위주",
  "korean-easy": "한식+간편식",
  "ultra-simple": "초간단 위주",
};

function WeekTab({
  weeks,
  activeWeek,
  onChange,
}: {
  weeks: number[];
  activeWeek: number;
  onChange: (w: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {weeks.map((w) => (
        <button
          key={w}
          onClick={() => onChange(w)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeWeek === w
              ? "bg-orange-500 text-white shadow"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          {w}주차
        </button>
      ))}
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("잘못된 접근입니다.");
      return;
    }

    const stored = sessionStorage.getItem(`plan-${sessionId}`);
    if (!stored) {
      setError("식단 데이터가 없습니다. 다시 생성해 주세요.");
      return;
    }

    try {
      const parsed: MealPlan = JSON.parse(stored);
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(`plan-${sessionId}`);
        setError("식단이 만료되었습니다. 다시 생성해 주세요.");
        return;
      }
      setPlan(parsed);

      // analytics
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "view_result", {
          period: parsed.userInput.period,
          goal: parsed.userInput.goal,
        });
      }
    } catch {
      setError("식단 데이터를 불러올 수 없습니다.");
    }
  }, [sessionId]);

  const handleReplace = useCallback(
    (day: number, mealType: MealType, newMeal: MealSlot) => {
      setPlan((prev) => {
        if (!prev) return prev;
        const updated: MealPlan = {
          ...prev,
          days: prev.days.map((d) =>
            d.day === day
              ? {
                  ...d,
                  [mealType]: newMeal,
                }
              : d
          ),
        };
        sessionStorage.setItem(`plan-${prev.sessionId}`, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">😢</div>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => router.push("/generate")}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium"
        >
          다시 식단 만들기
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500">식단을 불러오는 중...</p>
      </div>
    );
  }

  const totalWeeks = Math.ceil(plan.userInput.period / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekDays = plan.days.filter(
    (d) => d.day > (activeWeek - 1) * 7 && d.day <= activeWeek * 7
  );

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🍱</span>
          <h1 className="font-bold text-lg">{plan.userInput.period}일 맞춤 식단</h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {plan.userInput.headcount}인
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {GOAL_LABELS[plan.userInput.goal]}
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {STYLE_LABELS[plan.userInput.mealStyle]}
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            조리 {plan.userInput.cookTime}분 이내
          </span>
        </div>
        <p className="text-orange-100 text-xs mt-3">
          * 건강 참고용 식단이며 의료 조언이 아닙니다. 원하는 끼니는 언제든 교체할 수 있습니다.
        </p>
      </div>

      {/* Week tabs */}
      {totalWeeks > 1 && (
        <div className="mb-4">
          <WeekTab weeks={weeks} activeWeek={activeWeek} onChange={setActiveWeek} />
        </div>
      )}

      {/* Ad - 결과 상단 */}
      <AdBanner format="horizontal" className="mb-6" />

      {/* Day plans */}
      <div className="space-y-4">
        {weekDays.map((dayPlan: DayPlan, idx: number) => (
          <div key={dayPlan.day}>
            <DayPlanCard
              dayPlan={dayPlan}
              userInput={plan.userInput}
              currentPlan={plan.days}
              onReplace={handleReplace}
            />
            {/* Ad 삽입: 3일마다 광고 1회 */}
            {(idx + 1) % 3 === 0 && idx < weekDays.length - 1 && (
              <AdBanner format="rectangle" className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 pb-8">
        <button
          onClick={() => router.push("/generate")}
          className="flex-1 border border-orange-300 text-orange-500 font-medium py-3 rounded-xl"
        >
          새 식단 만들기
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-orange-500 text-white font-medium py-3 rounded-xl shadow"
        >
          저장 / 인쇄
        </button>
      </div>

      {/* Bottom ad */}
      <AdBanner format="horizontal" className="mb-4" />
    </main>
  );
}

export default function ResultPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        }
      >
        <ResultContent />
      </Suspense>
      <Footer />
    </>
  );
}
