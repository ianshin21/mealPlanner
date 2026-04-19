import type {
  UserInput,
  MenuItem,
  MealSlot,
  DayPlan,
  MealPlan,
  Goal,
} from "./types";
import menusData from "../data/menus.json";

const ALL_MENUS: MenuItem[] = menusData.menus as MenuItem[];

function filterMenus(userInput: UserInput): {
  mains: MenuItem[];
  sides: MenuItem[];
} {
  const { mealStyle, cookLevel, cookTime, dislikedIngredients, allergies, goal } =
    userInput;

  const normalized = (s: string) => s.trim().toLowerCase();
  const disliked = dislikedIngredients.map(normalized);
  const allergy = allergies.map(normalized);

  const isAllowed = (item: MenuItem) => {
    // Style filter
    if (!item.style.includes(mealStyle)) return false;
    // Cook level: beginner can only do beginner; basic can do both
    if (cookLevel === "beginner" && item.cookLevel !== "beginner") return false;
    // Cook time
    if (item.cookTime > cookTime) return false;
    // Allergen check
    if (item.allergens.some((a) => allergy.includes(normalized(a)))) return false;
    // Disliked ingredient check
    if (disliked.some((d) => normalized(item.mainIngredient).includes(d))) return false;
    // Goal fit
    if (!item.goalFit.includes(goal as Goal)) return false;
    return true;
  };

  const mains = ALL_MENUS.filter((m) => m.type === "main" && isAllowed(m));
  const sides = ALL_MENUS.filter((m) => m.type === "side" && isAllowed(m));

  // Fallback: relax goal filter if too few options
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

function pickSides(
  sides: MenuItem[],
  count: number,
  excludeIngredient: string,
  usedSideIds: Set<string>,
  rng: () => number
): MenuItem[] {
  const candidates = sides.filter(
    (s) =>
      !usedSideIds.has(s.id) &&
      s.mainIngredient !== excludeIngredient
  );
  const shuffled = shuffle(candidates, rng);
  const picked = shuffled.slice(0, count);
  // If not enough unique sides, allow repeats
  if (picked.length < count) {
    const extra = shuffle(sides, rng)
      .filter((s) => !picked.includes(s))
      .slice(0, count - picked.length);
    picked.push(...extra);
  }
  return picked;
}

function buildMealSlot(
  main: MenuItem,
  sides: MenuItem[],
  day: number,
  mealType: "lunch" | "dinner"
): MealSlot {
  return {
    id: `${day}-${mealType}`,
    main,
    sides,
  };
}

export function generateMealPlan(
  userInput: UserInput,
  sessionId: string
): MealPlan {
  const { period, goal } = userInput;
  const { mains, sides } = filterMenus(userInput);

  // Seed based on sessionId for reproducibility
  const seed = sessionId
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);

  const shuffledMains = shuffle(mains, rng);
  const days: DayPlan[] = [];

  // Track last used main ingredient to avoid consecutive repeats
  let lastLunchIngredient = "";
  let lastDinnerIngredient = "";
  const usedSideIds = new Set<string>();

  // How often sides repeat: reset every 7 days
  const SIDE_RESET_INTERVAL = 7;

  for (let day = 1; day <= period; day++) {
    if (day % SIDE_RESET_INTERVAL === 1) {
      usedSideIds.clear();
    }

    // Pick lunch main (avoid repeating main ingredient from previous lunch)
    const lunchCandidates = shuffledMains.filter(
      (m) => m.mainIngredient !== lastLunchIngredient
    );
    const lunchMainPool = lunchCandidates.length > 0 ? lunchCandidates : shuffledMains;
    const lunchMainIdx = Math.floor(rng() * lunchMainPool.length);
    const lunchMain = lunchMainPool[lunchMainIdx];

    // Pick dinner main (avoid repeating main ingredient from lunch and last dinner)
    const dinnerCandidates = shuffledMains.filter(
      (m) =>
        m.mainIngredient !== lunchMain.mainIngredient &&
        m.mainIngredient !== lastDinnerIngredient &&
        m.id !== lunchMain.id
    );
    const dinnerMainPool =
      dinnerCandidates.length > 0 ? dinnerCandidates : shuffledMains.filter((m) => m.id !== lunchMain.id);
    const dinnerMainIdx = Math.floor(rng() * dinnerMainPool.length);
    const dinnerMain = dinnerMainPool[dinnerMainIdx] || shuffledMains[0];

    // Sides: 1-2 depending on goal
    const sideCount = goal === "light-loss" ? 1 : 2;

    const lunchSides = pickSides(
      sides,
      sideCount,
      lunchMain.mainIngredient,
      usedSideIds,
      rng
    );
    lunchSides.forEach((s) => usedSideIds.add(s.id));

    const dinnerSides = pickSides(
      sides,
      sideCount,
      dinnerMain.mainIngredient,
      usedSideIds,
      rng
    );
    dinnerSides.forEach((s) => usedSideIds.add(s.id));

    days.push({
      day,
      lunch: buildMealSlot(lunchMain, lunchSides, day, "lunch"),
      dinner: buildMealSlot(dinnerMain, dinnerSides, day, "dinner"),
    });

    lastLunchIngredient = lunchMain.mainIngredient;
    lastDinnerIngredient = dinnerMain.mainIngredient;
  }

  const now = Date.now();
  return {
    sessionId,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24h TTL
    userInput,
    days,
  };
}

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
    ? mealType === "lunch"
      ? currentDay.lunch
      : currentDay.dinner
    : null;
  const currentMainId = currentMeal?.main.id;

  // Also get adjacent meals to avoid same ingredient
  const adjacentIngredients = new Set<string>();
  if (currentDay) {
    if (mealType === "lunch") {
      adjacentIngredients.add(currentDay.dinner.main.mainIngredient);
    } else {
      adjacentIngredients.add(currentDay.lunch.main.mainIngredient);
    }
  }
  const prevDay = currentDays.find((d) => d.day === targetDay - 1);
  if (prevDay) {
    adjacentIngredients.add(prevDay.lunch.main.mainIngredient);
    adjacentIngredients.add(prevDay.dinner.main.mainIngredient);
  }

  const candidates = mains.filter(
    (m) =>
      m.id !== currentMainId &&
      !adjacentIngredients.has(m.mainIngredient)
  );
  const pool = candidates.length > 0 ? candidates : mains.filter((m) => m.id !== currentMainId);
  const newMain = pool[Math.floor(rng() * pool.length)] || mains[0];

  const sideCount = userInput.goal === "light-loss" ? 1 : 2;
  const newSides = pickSides(sides, sideCount, newMain.mainIngredient, new Set(), rng);

  return {
    id: `${targetDay}-${mealType}`,
    main: newMain,
    sides: newSides,
  };
}
