"use client";

import { useState } from "react";
import type { MealSlot, MealType, DayPlan, UserInput } from "@/lib/types";

interface MealCardProps {
  slot: MealSlot;
  mealType: MealType;
  day: number;
  userInput: UserInput;
  currentPlan: DayPlan[];
  onReplace: (day: number, mealType: MealType, newMeal: MealSlot) => void;
}

export default function MealCard({
  slot,
  mealType,
  day,
  userInput,
  currentPlan,
  onReplace,
}: MealCardProps) {
  const [loading, setLoading] = useState(false);

  const handleReplace = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/replace-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day,
          mealType,
          userInput,
          currentPlan,
        }),
      });
      const data = await res.json();
      if (data.success && data.newMeal) {
        onReplace(day, mealType, data.newMeal);
        // analytics hook
        if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "replace_meal", {
            day,
            meal_type: mealType,
          });
        }
      }
    } catch {
      alert("교체 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const label = mealType === "lunch" ? "점심" : "저녁";
  const emoji = mealType === "lunch" ? "☀️" : "🌙";
  const bgColor = mealType === "lunch" ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100";
  const badgeColor = mealType === "lunch" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700";

  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {emoji} {label}
        </span>
        <button
          onClick={handleReplace}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block w-3 h-3 border border-gray-300 border-t-orange-500 rounded-full animate-spin" />
          ) : (
            "↺"
          )}
          이 끼니 바꾸기
        </button>
      </div>

      <div className="space-y-2">
        {/* Main dish */}
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5">🍽️</span>
          <div>
            <span className="font-semibold text-gray-900">{slot.main.name}</span>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs bg-white rounded px-1.5 py-0.5 border border-gray-200 text-gray-500">
                {slot.main.cookTime === 0 ? "바로" : `약 ${slot.main.cookTime}분`}
              </span>
              {slot.main.protein && slot.main.protein >= 20 && (
                <span className="text-xs bg-green-50 rounded px-1.5 py-0.5 border border-green-200 text-green-600">
                  고단백
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Side dishes */}
        {slot.sides.length > 0 && (
          <div className="border-t border-white/60 pt-2 mt-2">
            <div className="space-y-1">
              {slot.sides.map((side) => (
                <div key={side.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">+</span>
                  <span>{side.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
