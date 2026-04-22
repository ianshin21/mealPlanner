import type {
  UserInput,
  MenuItem,
  MealSlot,
  DayPlan,
  MealPlan,
  Goal,
  CookingMethod,
} from "./types";
import { GOAL_NUTRITION } from "./types";
import menusData from "../data/menus.json";

const ALL_MENUS: MenuItem[] = menusData.menus as MenuItem[];

// ─── 설정 상수 ───────────────────────────────────────────────────────────────

/** 같은 조리법이 최근 N끼 안에 몇 번까지 나올 수 있는지 */
const MAX_SAME_COOKING_METHOD_IN_WINDOW = 2;
/** 반복 체크를 위한 윈도우 크기 (최근 N끼) */
const COOKING_METHOD_WINDOW = 4;
/** 반찬 풀 리셋 주기 (일) */
const SIDE_RESET_INTERVAL = 7;

// ─── 필터 ────────────────────────────────────────────────────────────────────

export function filterMenus(userInput: UserInput): {
  mains: MenuItem[];
  sides: MenuItem[];
} {
  const { mealStyle, cookLevel, cookTime, dislikedIngredients, allergies, goal } = userInput;

  const normalized = (s: string) => s.trim().toLowerCase();
  const disliked = dislikedIngredients.map(normalized);
  const allergy = allergies.map(normalized);

  const isAllowed = (item: MenuItem) => {
    if (!item.style.includes(mealStyle)) return false;
    if (cookLevel === "beginner" && item.cookLevel !== "beginner") return false;
    if (item.cookTime > cookTime) return false;
    if (item.allergens.some((a) => allergy.includes(normalized(a)))) return false;
    if (disliked.some((d) => normalized(item.mainIngredient).includes(d))) return false;
    if (!item.goalFit.includes(goal as Goal)) return false;
    return true;
  };

  const mains = ALL_MENUS.filter((m) => m.type === "main" && isAllowed(m));
  const sides = ALL_MENUS.filter((m) => m.type === "side" && isAllowed(m));

  // 목표 필터 완화: 메인 메뉴가 너무 적을 때
  if (mains.length < 8) {
    const fallbackMains = ALL_MENUS.filter(
      (m) =>
        m.type === "main" &&
        m.style.includes(mealStyle) &&
        (cookLevel === "beginner" ? m.cookLevel === "beginner" : true) &&
        m.cookTime <= cookTime &&
        !m.allergens.some((a) => allergy.includes(normalized(a))) &&
        !disliked.some((d) => normalized(m.mainIngredient).includes(d))
    );
    return { mains: fallbackMains, sides };
  }

  return { mains, sides };
}

// ─── 난수 유틸 ───────────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── familiarity 가중 선택 ────────────────────────────────────────────────────
/**
 * familiarityScore가 높은 메뉴를 더 자주 뽑는 가중 랜덤 선택.
 * score를 그대로 weight로 사용 (0-100).
 */
function weightedPick<T extends MenuItem>(pool: T[], rng: () => number): T {
  const totalWeight = pool.reduce((s, m) => s + m.familiarityScore, 0);
  let r = rng() * totalWeight;
  for (const item of pool) {
    r -= item.familiarityScore;
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

// ─── 조리법 반복 체크 ─────────────────────────────────────────────────────────
/**
 * recentMethods: 최근 끼니 조리법 목록 (오래된 순 → 최신 순)
 * 새로 추가하려는 method가 윈도우 내 MAX_SAME_COOKING_METHOD_IN_WINDOW번 이상이면 true.
 */
function isCookingMethodOverused(
  method: CookingMethod,
  recentMethods: CookingMethod[]
): boolean {
  const window = recentMethods.slice(-COOKING_METHOD_WINDOW);
  const count = window.filter((m) => m === method).length;
  return count >= MAX_SAME_COOKING_METHOD_IN_WINDOW;
}

// ─── 반찬 선택 ───────────────────────────────────────────────────────────────

function pickSides(
  sides: MenuItem[],
  count: number,
  excludeIngredient: string,
  usedSideIds: Set<string>,
  rng: () => number
): MenuItem[] {
  const candidates = sides.filter(
    (s) => !usedSideIds.has(s.id) && s.mainIngredient !== excludeIngredient
  );
  // familiarity 가중 순으로 정렬 후 앞에서부터 선택
  const sorted = [...candidates].sort((a, b) => b.familiarityScore - a.familiarityScore);
  const shuffled = shuffle(sorted, rng); // 약간의 랜덤성 유지
  const picked = shuffled.slice(0, count);

  if (picked.length < count) {
    const extra = shuffle(sides, rng)
      .filter((s) => !picked.includes(s))
      .slice(0, count - picked.length);
    picked.push(...extra);
  }
  return picked;
}

// ─── 하루치 끼니 생성 ─────────────────────────────────────────────────────────

interface DayMealContext {
  mains: MenuItem[];
  sides: MenuItem[];
  goal: Goal;
  lastLunchIngredient: string;
  lastDinnerIngredient: string;
  recentCookingMethods: CookingMethod[]; // 최근 끼니 조리법 (최신 순)
  usedSideIds: Set<string>;
  rng: () => number;
  day: number;
}

interface DayMealResult {
  lunch: MealSlot;
  dinner: MealSlot;
  lunchIngredient: string;
  dinnerIngredient: string;
  lunchCookingMethod: CookingMethod;
  dinnerCookingMethod: CookingMethod;
}

export function generateDayMeal(ctx: DayMealContext): DayMealResult {
  const { mains, sides, goal, lastLunchIngredient, lastDinnerIngredient,
          recentCookingMethods, usedSideIds, rng, day } = ctx;

  // ── 점심 메인 선택 ──────────────────────────────────────
  const lunchPool = mains.filter(
    (m) =>
      m.mainIngredient !== lastLunchIngredient &&
      !isCookingMethodOverused(m.cookingMethod, recentCookingMethods)
  );
  const lunchFallback = mains.filter((m) => m.mainIngredient !== lastLunchIngredient);
  const lunchCandidates = lunchPool.length > 0 ? lunchPool : (lunchFallback.length > 0 ? lunchFallback : mains);
  const lunchMain = weightedPick(lunchCandidates, rng);

  // ── 저녁 메인 선택 ──────────────────────────────────────
  const methodsAfterLunch: CookingMethod[] = [...recentCookingMethods, lunchMain.cookingMethod];
  const dinnerPool = mains.filter(
    (m) =>
      m.id !== lunchMain.id &&
      m.mainIngredient !== lunchMain.mainIngredient &&
      m.mainIngredient !== lastDinnerIngredient &&
      !isCookingMethodOverused(m.cookingMethod, methodsAfterLunch)
  );
  const dinnerFallback = mains.filter(
    (m) => m.id !== lunchMain.id && m.mainIngredient !== lunchMain.mainIngredient
  );
  const dinnerCandidates = dinnerPool.length > 0 ? dinnerPool : (dinnerFallback.length > 0 ? dinnerFallback : mains.filter((m) => m.id !== lunchMain.id));
  const dinnerMain = weightedPick(dinnerCandidates.length > 0 ? dinnerCandidates : mains, rng);

  // ── 목표별 반찬 수 결정 ─────────────────────────────────
  const nutrition = GOAL_NUTRITION[goal];
  const baseLunchCal = lunchMain.calories ?? 200;
  const baseDinnerCal = dinnerMain.calories ?? 200;

  // 목표 칼로리 구간 내로 맞추기 위해 반찬 수 조정
  const estimatedTotal = baseLunchCal + baseDinnerCal;
  let sideCount: number;
  if (goal === "light-loss") {
    sideCount = 1;
  } else if (goal === "high-protein") {
    // 단백질 목표 달성을 위해 단백질 반찬 선호 (수는 2)
    sideCount = 2;
  } else {
    // balanced: 칼로리가 너무 낮으면 2개, 충분하면 1-2개
    sideCount = estimatedTotal < nutrition.minCalories ? 2 : 2;
  }

  // ── 반찬 선택 ───────────────────────────────────────────
  // high-protein 목표: 단백질 높은 반찬 우선
  let sidePool = sides;
  if (goal === "high-protein") {
    const highProtein = sides.filter((s) => (s.protein ?? 0) >= 5);
    if (highProtein.length >= sideCount * 2) sidePool = highProtein;
  }

  const lunchSides = pickSides(sidePool, sideCount, lunchMain.mainIngredient, usedSideIds, rng);
  lunchSides.forEach((s) => usedSideIds.add(s.id));

  const dinnerSides = pickSides(sidePool, sideCount, dinnerMain.mainIngredient, usedSideIds, rng);
  dinnerSides.forEach((s) => usedSideIds.add(s.id));

  return {
    lunch: { id: `${day}-lunch`, main: lunchMain, sides: lunchSides },
    dinner: { id: `${day}-dinner`, main: dinnerMain, sides: dinnerSides },
    lunchIngredient: lunchMain.mainIngredient,
    dinnerIngredient: dinnerMain.mainIngredient,
    lunchCookingMethod: lunchMain.cookingMethod,
    dinnerCookingMethod: dinnerMain.cookingMethod,
  };
}

// ─── 캘린더 생성 ─────────────────────────────────────────────────────────────

export function generateMealPlan(
  userInput: UserInput,
  sessionId: string
): MealPlan {
  const { period, goal } = userInput;
  const { mains, sides } = filterMenus(userInput);

  const seed = sessionId
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);

  const days: DayPlan[] = [];

  let lastLunchIngredient = "";
  let lastDinnerIngredient = "";
  // 최근 끼니의 조리법 히스토리 (오래된 순)
  const recentCookingMethods: CookingMethod[] = [];
  const usedSideIds = new Set<string>();

  for (let day = 1; day <= period; day++) {
    if ((day - 1) % SIDE_RESET_INTERVAL === 0 && day > 1) {
      usedSideIds.clear();
    }

    const result = generateDayMeal({
      mains,
      sides,
      goal: goal as Goal,
      lastLunchIngredient,
      lastDinnerIngredient,
      recentCookingMethods: [...recentCookingMethods],
      usedSideIds,
      rng,
      day,
    });

    days.push({
      day,
      lunch: result.lunch,
      dinner: result.dinner,
    });

    lastLunchIngredient = result.lunchIngredient;
    lastDinnerIngredient = result.dinnerIngredient;

    // 히스토리 추가 (오래된 것은 자동으로 windowSize 초과시 무시됨)
    recentCookingMethods.push(result.lunchCookingMethod, result.dinnerCookingMethod);
    if (recentCookingMethods.length > COOKING_METHOD_WINDOW * 2) {
      recentCookingMethods.splice(0, 2);
    }
  }

  const now = Date.now();
  return {
    sessionId,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
    userInput,
    days,
  };
}

// ─── 끼니 교체 ───────────────────────────────────────────────────────────────

export function replaceOneMeal(
  userInput: UserInput,
  currentDays: DayPlan[],
  targetDay: number,
  mealType: "lunch" | "dinner",
  replaceSeed: number
): MealSlot {
  const { mains, sides } = filterMenus(userInput);
  const rng = seededRandom(replaceSeed);

  const currentDay = currentDays.find((d) => d.day === targetDay);
  const currentMeal = currentDay
    ? mealType === "lunch" ? currentDay.lunch : currentDay.dinner
    : null;
  const currentMainId = currentMeal?.main.id;

  // 인접 끼니 재료·조리법 수집
  const adjacentIngredients = new Set<string>();
  const adjacentMethods = new Set<CookingMethod>();

  if (currentDay) {
    const other = mealType === "lunch" ? currentDay.dinner : currentDay.lunch;
    adjacentIngredients.add(other.main.mainIngredient);
    adjacentMethods.add(other.main.cookingMethod);
  }
  const prevDay = currentDays.find((d) => d.day === targetDay - 1);
  if (prevDay) {
    adjacentIngredients.add(prevDay.lunch.main.mainIngredient);
    adjacentIngredients.add(prevDay.dinner.main.mainIngredient);
    adjacentMethods.add(prevDay.lunch.main.cookingMethod);
    adjacentMethods.add(prevDay.dinner.main.cookingMethod);
  }

  // 조리법 중복 최대한 피해서 후보 구성
  let candidates = mains.filter(
    (m) =>
      m.id !== currentMainId &&
      !adjacentIngredients.has(m.mainIngredient) &&
      !adjacentMethods.has(m.cookingMethod)
  );
  if (candidates.length === 0) {
    candidates = mains.filter(
      (m) => m.id !== currentMainId && !adjacentIngredients.has(m.mainIngredient)
    );
  }
  if (candidates.length === 0) {
    candidates = mains.filter((m) => m.id !== currentMainId);
  }

  const newMain = weightedPick(candidates.length > 0 ? candidates : mains, rng);

  const sideCount = userInput.goal === "light-loss" ? 1 : 2;
  const newSides = pickSides(sides, sideCount, newMain.mainIngredient, new Set(), rng);

  return {
    id: `${targetDay}-${mealType}`,
    main: newMain,
    sides: newSides,
  };
}
