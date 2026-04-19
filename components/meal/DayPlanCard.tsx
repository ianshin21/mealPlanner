"use client";

import type { DayPlan, MealSlot, MealType, UserInput } from "@/lib/types";
import MealCard from "./MealCard";

interface DayPlanCardProps {
  dayPlan: DayPlan;
  userInput: UserInput;
  currentPlan: DayPlan[];
  onReplace: (day: number, mealType: MealType, newMeal: MealSlot) => void;
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DayPlanCard({
  dayPlan,
  userInput,
  currentPlan,
  onReplace,
}: DayPlanCardProps) {
  // Generate a display date starting from today
  const today = new Date();
  const displayDate = new Date(today);
  displayDate.setDate(today.getDate() + dayPlan.day - 1);
  const month = displayDate.getMonth() + 1;
  const date = displayDate.getDate();
  const weekDay = WEEK_DAYS[displayDate.getDay()];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Day header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-between">
        <div className="text-white">
          <span className="font-bold text-lg">{dayPlan.day}일차</span>
          <span className="ml-2 text-orange-100 text-sm">
            {month}/{date} ({weekDay})
          </span>
        </div>
      </div>

      {/* Meals */}
      <div className="p-4 space-y-3">
        <MealCard
          slot={dayPlan.lunch}
          mealType="lunch"
          day={dayPlan.day}
          userInput={userInput}
          currentPlan={currentPlan}
          onReplace={onReplace}
        />
        <MealCard
          slot={dayPlan.dinner}
          mealType="dinner"
          day={dayPlan.day}
          userInput={userInput}
          currentPlan={currentPlan}
          onReplace={onReplace}
        />
      </div>
    </div>
  );
}
