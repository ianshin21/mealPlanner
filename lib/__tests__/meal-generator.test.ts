import { describe, it, expect } from "vitest";
import { generateMealPlan, replaceOneMeal, filterMenus } from "../meal-generator";
import type { UserInput } from "../types";

// ─── 공통 입력값 픽스처 ───────────────────────────────────────────────────────

const BASE_INPUT: UserInput = {
  period: 14,
  headcount: 1,
  goal: "balanced",
  mealStyle: "korean-easy",
  cookLevel: "beginner",
  cookTime: 30,
  dislikedIngredients: [],
  allergies: [],
};

function makeInput(overrides: Partial<UserInput> = {}): UserInput {
  return { ...BASE_INPUT, ...overrides };
}

// ─── filterMenus ─────────────────────────────────────────────────────────────

describe("filterMenus", () => {
  it("스타일 필터: korean-easy 선택 시 ultra-simple 전용 메뉴 제외", () => {
    const { mains } = filterMenus(makeInput({ mealStyle: "korean-easy" }));
    mains.forEach((m) =>
      expect(m.style).toContain("korean-easy")
    );
  });

  it("조리 시간 필터: cookTime=10이면 10분 초과 메뉴 제외", () => {
    const { mains } = filterMenus(makeInput({ cookTime: 10 }));
    mains.forEach((m) => expect(m.cookTime).toBeLessThanOrEqual(10));
  });

  it("요리 수준 필터: beginner 선택 시 basic 메뉴 제외", () => {
    const { mains } = filterMenus(makeInput({ cookLevel: "beginner" }));
    mains.forEach((m) => expect(m.cookLevel).toBe("beginner"));
  });

  it("알레르기 필터: 계란 알레르기 선택 시 계란 포함 메뉴 제외", () => {
    const { mains } = filterMenus(makeInput({ allergies: ["계란"] }));
    mains.forEach((m) =>
      expect(m.allergens).not.toContain("계란")
    );
  });

  it("비선호 재료 필터: 두부 비선호 시 두부 메인 메뉴 제외", () => {
    const { mains } = filterMenus(makeInput({ dislikedIngredients: ["두부"] }));
    mains.forEach((m) =>
      expect(m.mainIngredient.toLowerCase()).not.toContain("두부")
    );
  });

  it("목표 필터: light-loss 선택 시 goalFit에 light-loss 포함된 메뉴만 노출", () => {
    const { mains } = filterMenus(makeInput({ goal: "light-loss" }));
    mains.forEach((m) => expect(m.goalFit).toContain("light-loss"));
  });

  it("필터 후 mains는 최소 1개 이상 반환 (fallback 작동 확인)", () => {
    // 매우 제한적인 조건 → fallback으로 goal 필터 완화
    const { mains } = filterMenus(
      makeInput({ mealStyle: "ultra-simple", cookTime: 10, cookLevel: "beginner" })
    );
    expect(mains.length).toBeGreaterThan(0);
  });
});

// ─── generateMealPlan ─────────────────────────────────────────────────────────

describe("generateMealPlan", () => {
  it("14일 식단: days 배열이 정확히 14개", () => {
    const plan = generateMealPlan(makeInput({ period: 14 }), "test-session-1");
    expect(plan.days).toHaveLength(14);
  });

  it("28일 식단: days 배열이 정확히 28개", () => {
    const plan = generateMealPlan(makeInput({ period: 28 }), "test-session-2");
    expect(plan.days).toHaveLength(28);
  });

  it("각 day에 lunch와 dinner가 존재한다", () => {
    const plan = generateMealPlan(BASE_INPUT, "test-session-3");
    for (const day of plan.days) {
      expect(day.lunch).toBeDefined();
      expect(day.dinner).toBeDefined();
      expect(day.lunch.main).toBeDefined();
      expect(day.dinner.main).toBeDefined();
    }
  });

  it("같은 sessionId이면 동일한 식단이 생성된다 (결정론적)", () => {
    const id = "deterministic-test";
    const plan1 = generateMealPlan(BASE_INPUT, id);
    const plan2 = generateMealPlan(BASE_INPUT, id);
    const names1 = plan1.days.map((d) => `${d.lunch.main.name}/${d.dinner.main.name}`);
    const names2 = plan2.days.map((d) => `${d.lunch.main.name}/${d.dinner.main.name}`);
    expect(names1).toEqual(names2);
  });

  it("같은 날 점심과 저녁의 메인 재료가 겹치지 않는다", () => {
    const plan = generateMealPlan(BASE_INPUT, "test-session-4");
    for (const day of plan.days) {
      expect(day.lunch.main.mainIngredient).not.toBe(
        day.dinner.main.mainIngredient
      );
    }
  });

  it("연속된 날의 점심 메인 재료가 반복되지 않는다", () => {
    const plan = generateMealPlan(BASE_INPUT, "test-session-5");
    for (let i = 1; i < plan.days.length; i++) {
      const prev = plan.days[i - 1].lunch.main.mainIngredient;
      const curr = plan.days[i].lunch.main.mainIngredient;
      expect(prev).not.toBe(curr);
    }
  });

  it("연속된 날의 저녁 메인 재료가 반복되지 않는다", () => {
    const plan = generateMealPlan(BASE_INPUT, "test-session-6");
    for (let i = 1; i < plan.days.length; i++) {
      const prev = plan.days[i - 1].dinner.main.mainIngredient;
      const curr = plan.days[i].dinner.main.mainIngredient;
      expect(prev).not.toBe(curr);
    }
  });

  it("light-loss 목표: 반찬이 끼니당 1개", () => {
    const plan = generateMealPlan(makeInput({ goal: "light-loss" }), "test-loss");
    for (const day of plan.days) {
      expect(day.lunch.sides).toHaveLength(1);
      expect(day.dinner.sides).toHaveLength(1);
    }
  });

  it("balanced 목표: 반찬이 끼니당 2개", () => {
    const plan = generateMealPlan(makeInput({ goal: "balanced" }), "test-balanced");
    for (const day of plan.days) {
      expect(day.lunch.sides).toHaveLength(2);
      expect(day.dinner.sides).toHaveLength(2);
    }
  });

  it("조리법 반복 제한: 4끼 윈도우 내 동일 조리법이 3회 이상 연속되지 않는다", () => {
    const plan = generateMealPlan(BASE_INPUT, "cooking-method-test");
    const methods: string[] = [];
    for (const day of plan.days) {
      methods.push(day.lunch.main.cookingMethod, day.dinner.main.cookingMethod);
    }
    // 슬라이딩 윈도우 4 안에서 같은 조리법이 3회 이상인지 체크
    for (let i = 0; i <= methods.length - 4; i++) {
      const window = methods.slice(i, i + 4);
      const counts: Record<string, number> = {};
      for (const m of window) counts[m] = (counts[m] ?? 0) + 1;
      for (const [method, cnt] of Object.entries(counts)) {
        expect(cnt, `조리법 "${method}" 이 윈도우 [${i}~${i+3}] 안에서 ${cnt}회 등장`).toBeLessThan(3);
      }
    }
  });

  it("반찬의 메인 재료가 해당 끼니 메인 재료와 겹치지 않는다", () => {
    const plan = generateMealPlan(BASE_INPUT, "side-conflict-test");
    for (const day of plan.days) {
      for (const side of day.lunch.sides) {
        expect(side.mainIngredient).not.toBe(day.lunch.main.mainIngredient);
      }
      for (const side of day.dinner.sides) {
        expect(side.mainIngredient).not.toBe(day.dinner.main.mainIngredient);
      }
    }
  });

  it("expiresAt은 createdAt + 24시간이다", () => {
    const plan = generateMealPlan(BASE_INPUT, "ttl-test");
    expect(plan.expiresAt - plan.createdAt).toBeCloseTo(24 * 60 * 60 * 1000, -3);
  });

  it("allergens 설정이 실제 식단에 반영된다 (계란 알레르기 → 계란 메뉴 없음)", () => {
    const plan = generateMealPlan(
      makeInput({ allergies: ["계란"] }),
      "allergy-test"
    );
    for (const day of plan.days) {
      expect(day.lunch.main.allergens).not.toContain("계란");
      expect(day.dinner.main.allergens).not.toContain("계란");
    }
  });
});

// ─── replaceOneMeal ───────────────────────────────────────────────────────────

describe("replaceOneMeal", () => {
  const plan = generateMealPlan(BASE_INPUT, "replace-base");

  it("교체된 끼니의 main이 기존과 다르다", () => {
    const original = plan.days[0].lunch.main.id;
    const newMeal = replaceOneMeal(BASE_INPUT, plan.days, 1, "lunch", 12345);
    expect(newMeal.main.id).not.toBe(original);
  });

  it("교체된 끼니에도 sides가 존재한다", () => {
    const newMeal = replaceOneMeal(BASE_INPUT, plan.days, 1, "dinner", 99999);
    expect(newMeal.sides.length).toBeGreaterThan(0);
  });

  it("교체된 끼니의 메인 재료가 같은 날 다른 끼니와 겹치지 않는다", () => {
    const targetDay = plan.days[2];
    const newLunch = replaceOneMeal(BASE_INPUT, plan.days, 3, "lunch", 54321);
    expect(newLunch.main.mainIngredient).not.toBe(
      targetDay.dinner.main.mainIngredient
    );
  });

  it("교체 seed가 다르면 다른 결과가 나올 수 있다", () => {
    const meal1 = replaceOneMeal(BASE_INPUT, plan.days, 1, "lunch", 100);
    const meal2 = replaceOneMeal(BASE_INPUT, plan.days, 1, "lunch", 200);
    // 반드시 달라야 하는 건 아니지만 seed가 다르면 대부분 다름
    // 최소한 함수가 오류 없이 실행된다는 것을 확인
    expect(meal1.main).toBeDefined();
    expect(meal2.main).toBeDefined();
  });

  it("light-loss 목표: 교체 후에도 반찬 1개", () => {
    const lossInput = makeInput({ goal: "light-loss" });
    const lossPlan = generateMealPlan(lossInput, "replace-loss");
    const newMeal = replaceOneMeal(lossInput, lossPlan.days, 1, "lunch", 777);
    expect(newMeal.sides).toHaveLength(1);
  });
});

// ─── familiarityScore 동작 확인 ───────────────────────────────────────────────

describe("familiarityScore", () => {
  it("생성된 메뉴들의 familiarityScore 평균이 60 이상이다 (친숙한 메뉴 우선)", () => {
    const plan = generateMealPlan(BASE_INPUT, "familiarity-check");
    const scores = plan.days.flatMap((d) => [
      d.lunch.main.familiarityScore,
      d.dinner.main.familiarityScore,
    ]);
    const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
    expect(avg).toBeGreaterThanOrEqual(60);
  });
});
