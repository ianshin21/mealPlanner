"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";
import type {
  UserInput,
  Period,
  Headcount,
  Goal,
  MealStyle,
  CookLevel,
  CookTime,
  Gender,
  AgeGroup,
  ActivityLevel,
  WeightGoal,
  Budget,
  MealPlan,
} from "@/lib/types";

const ALLERGIES_LIST = [
  "계란", "우유", "밀", "땅콩", "콩", "생선", "조개류", "돼지고기", "닭고기", "새우",
];
const DISLIKED_LIST = [
  "두부", "고수", "내장", "해산물", "버섯", "고등어", "오징어", "마늘", "파", "된장",
];

function OptionButton<T extends string | number>({
  value,
  selected,
  onClick,
  children,
}: {
  value: T;
  selected: boolean;
  onClick: (v: T) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? "bg-orange-500 border-orange-500 text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-700 active:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
        selected
          ? "bg-red-50 border-red-300 text-red-600"
          : "bg-white border-gray-200 text-gray-600"
      }`}
    >
      {selected ? "✕ " : ""}{label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h2 className="font-bold text-gray-900 mb-4 text-base">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 mb-2">{children}</p>;
}

export default function GeneratePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  // Required inputs
  const [period, setPeriod] = useState<Period>(14);
  const [headcount, setHeadcount] = useState<Headcount>(1);
  const [goal, setGoal] = useState<Goal>("balanced");
  const [mealStyle, setMealStyle] = useState<MealStyle>("korean-easy");
  const [cookLevel, setCookLevel] = useState<CookLevel>("beginner");
  const [cookTime, setCookTime] = useState<CookTime>(20);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);

  // Optional inputs
  const [gender, setGender] = useState<Gender>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("");
  const [weightGoal, setWeightGoal] = useState<WeightGoal>("");
  const [budget, setBudget] = useState<Budget>("");

  const toggleAllergy = (item: string) =>
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  const toggleDisliked = (item: string) =>
    setDisliked((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userInput: UserInput = {
      period,
      headcount,
      goal,
      mealStyle,
      cookLevel,
      cookTime,
      dislikedIngredients: disliked,
      allergies,
      gender: gender || undefined,
      ageGroup: ageGroup || undefined,
      activityLevel: activityLevel || undefined,
      weightGoal: weightGoal || undefined,
      budget: budget || undefined,
    };

    // analytics
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "generate_start", {
        period,
        goal,
        meal_style: mealStyle,
      });
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInput }),
        });

        const data: { success: boolean; plan?: MealPlan; error?: string } = await res.json();

        if (!data.success || !data.plan) {
          setError(data.error || "식단 생성에 실패했습니다. 다시 시도해 주세요.");
          return;
        }

        // Store in sessionStorage
        sessionStorage.setItem(`plan-${data.plan.sessionId}`, JSON.stringify(data.plan));
        router.push(`/result?session=${data.plan.sessionId}`);
      } catch {
        setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    });
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">내 맞춤 식단 만들기</h1>
          <p className="text-sm text-gray-500 mt-1">아래 조건을 선택하면 자동으로 식단이 생성됩니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 기간 */}
          <Section title="📅 기간">
            <Label>몇 일치 식단이 필요하신가요?</Label>
            <div className="flex gap-3">
              <OptionButton value={14} selected={period === 14} onClick={setPeriod}>
                14일 (2주)
              </OptionButton>
              <OptionButton value={28} selected={period === 28} onClick={setPeriod}>
                28일 (4주)
              </OptionButton>
            </div>
          </Section>

          {/* 인원 */}
          <Section title="👤 인원">
            <Label>몇 명이 드시나요?</Label>
            <div className="flex gap-3">
              <OptionButton value={1} selected={headcount === 1} onClick={setHeadcount}>
                1인
              </OptionButton>
              <OptionButton value={2} selected={headcount === 2} onClick={setHeadcount}>
                2인
              </OptionButton>
            </div>
          </Section>

          {/* 목표 */}
          <Section title="🎯 건강 목표">
            <Label>어떤 방향으로 식단을 구성할까요?</Label>
            <div className="flex flex-col gap-2">
              <OptionButton value="light-loss" selected={goal === "light-loss"} onClick={setGoal}>
                🏃 가볍게 감량 — 칼로리를 조금 줄인 식단
              </OptionButton>
              <OptionButton value="balanced" selected={goal === "balanced"} onClick={setGoal}>
                ⚖️ 균형 건강관리 — 골고루 먹는 균형 식단
              </OptionButton>
              <OptionButton value="high-protein" selected={goal === "high-protein"} onClick={setGoal}>
                💪 단백질 챙기기 — 근육 유지·증량 도움
              </OptionButton>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * 건강 참고용 정보이며 의료 조언이 아닙니다.
            </p>
          </Section>

          {/* 식사 스타일 */}
          <Section title="🥘 식사 스타일">
            <Label>어떤 종류의 음식을 원하세요?</Label>
            <div className="flex flex-col gap-2">
              <OptionButton value="korean" selected={mealStyle === "korean"} onClick={setMealStyle}>
                🍚 한식 위주 — 찌개, 볶음, 나물 중심
              </OptionButton>
              <OptionButton value="korean-easy" selected={mealStyle === "korean-easy"} onClick={setMealStyle}>
                🍳 한식+간편식 — 한식에 간단한 메뉴 포함
              </OptionButton>
              <OptionButton value="ultra-simple" selected={mealStyle === "ultra-simple"} onClick={setMealStyle}>
                ⚡ 초간단 위주 — 10분 내외 빠른 메뉴 중심
              </OptionButton>
            </div>
          </Section>

          {/* 요리 수준 */}
          <Section title="🍴 요리 수준">
            <Label>요리 경험이 어느 정도 되시나요?</Label>
            <div className="flex gap-3">
              <OptionButton value="beginner" selected={cookLevel === "beginner"} onClick={setCookLevel}>
                완전 초보 (라면도 처음)
              </OptionButton>
              <OptionButton value="basic" selected={cookLevel === "basic"} onClick={setCookLevel}>
                초보 가능 (기본 볶음 OK)
              </OptionButton>
            </div>
          </Section>

          {/* 조리 시간 */}
          <Section title="⏱️ 한 끼 조리 시간">
            <Label>한 끼를 만드는 데 얼마나 쓸 수 있나요?</Label>
            <div className="flex gap-3">
              <OptionButton value={10} selected={cookTime === 10} onClick={setCookTime}>
                10분
              </OptionButton>
              <OptionButton value={20} selected={cookTime === 20} onClick={setCookTime}>
                20분
              </OptionButton>
              <OptionButton value={30} selected={cookTime === 30} onClick={setCookTime}>
                30분
              </OptionButton>
            </div>
          </Section>

          {/* 알레르기 */}
          <Section title="⚠️ 알레르기 식재료">
            <Label>해당하는 항목을 모두 선택하세요 (선택 안 해도 됩니다)</Label>
            <div className="flex flex-wrap gap-2">
              {ALLERGIES_LIST.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  selected={allergies.includes(item)}
                  onToggle={() => toggleAllergy(item)}
                />
              ))}
            </div>
          </Section>

          {/* 비선호 식재료 */}
          <Section title="🚫 싫어하는 재료">
            <Label>빼고 싶은 식재료를 선택하세요 (선택 안 해도 됩니다)</Label>
            <div className="flex flex-wrap gap-2">
              {DISLIKED_LIST.map((item) => (
                <ToggleChip
                  key={item}
                  label={item}
                  selected={disliked.includes(item)}
                  onToggle={() => toggleDisliked(item)}
                />
              ))}
            </div>
          </Section>

          {/* Optional inputs */}
          <div>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full text-sm text-gray-500 py-3 border border-dashed border-gray-200 rounded-xl"
            >
              {showOptional ? "▲" : "▼"} 선택 입력 (성별, 나이대, 활동량, 예산) — 더 정확한 식단에 도움
            </button>

            {showOptional && (
              <div className="mt-3 space-y-4">
                {/* 성별 */}
                <Section title="성별 (선택)">
                  <div className="flex gap-2 flex-wrap">
                    {(["male", "female", "other"] as Gender[]).map((g) => (
                      <OptionButton key={g} value={g} selected={gender === g} onClick={setGender}>
                        {g === "male" ? "남성" : g === "female" ? "여성" : "기타"}
                      </OptionButton>
                    ))}
                  </div>
                </Section>

                {/* 나이대 */}
                <Section title="나이대 (선택)">
                  <div className="flex gap-2 flex-wrap">
                    {(["20s", "30s", "40s", "50s+"] as AgeGroup[]).map((a) => (
                      <OptionButton key={a} value={a} selected={ageGroup === a} onClick={setAgeGroup}>
                        {a === "50s+" ? "50대 이상" : a.replace("s", "대")}
                      </OptionButton>
                    ))}
                  </div>
                </Section>

                {/* 활동량 */}
                <Section title="활동량 (선택)">
                  <div className="flex gap-2 flex-wrap">
                    {(["low", "medium", "high"] as ActivityLevel[]).map((al) => (
                      <OptionButton key={al} value={al} selected={activityLevel === al} onClick={setActivityLevel}>
                        {al === "low" ? "적음 (주로 앉아서)" : al === "medium" ? "보통" : "많음 (운동 자주)"}
                      </OptionButton>
                    ))}
                  </div>
                </Section>

                {/* 체중 방향 */}
                <Section title="체중 방향 (선택)">
                  <div className="flex gap-2 flex-wrap">
                    {(["lose", "maintain", "gain"] as WeightGoal[]).map((wg) => (
                      <OptionButton key={wg} value={wg} selected={weightGoal === wg} onClick={setWeightGoal}>
                        {wg === "lose" ? "감량" : wg === "maintain" ? "유지" : "증량"}
                      </OptionButton>
                    ))}
                  </div>
                </Section>

                {/* 예산 */}
                <Section title="1끼 예산 (선택)">
                  <div className="flex gap-2 flex-wrap">
                    {(["low", "medium", "high"] as Budget[]).map((b) => (
                      <OptionButton key={b} value={b} selected={budget === b} onClick={setBudget}>
                        {b === "low" ? "저렴하게 (~3천원)" : b === "medium" ? "보통 (~6천원)" : "여유 있게"}
                      </OptionButton>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 면책 안내 */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            본 식단 정보는 일반 성인의 건강 참고용이며 의료·영양 조언이 아닙니다.
            질환이 있거나 특별한 식이 관리가 필요한 경우 전문가와 상담하세요.
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:bg-orange-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                식단 생성 중...
              </>
            ) : (
              "🍱 식단 생성하기"
            )}
          </button>
        </form>

        <AdBanner format="horizontal" className="mt-8 mb-4" />
      </main>
      <Footer />
    </>
  );
}
