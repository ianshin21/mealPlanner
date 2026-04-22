export type Period = 14 | 28;
export type Headcount = 1 | 2;
export type Goal = "light-loss" | "balanced" | "high-protein";
export type MealStyle = "korean" | "korean-easy" | "ultra-simple";
export type CookLevel = "beginner" | "basic";
export type CookTime = 10 | 20 | 30;
export type Gender = "male" | "female" | "other" | "";
export type AgeGroup = "20s" | "30s" | "40s" | "50s+" | "";
export type ActivityLevel = "low" | "medium" | "high" | "";
export type WeightGoal = "lose" | "maintain" | "gain" | "";
export type Budget = "low" | "medium" | "high" | "";

// 조리법 태그 — 반복 제한에 사용
export type CookingMethod =
  | "찌개"
  | "국"
  | "볶음"
  | "조림"
  | "구이"
  | "찜"
  | "무침"
  | "나물"
  | "덮밥"
  | "비빔"
  | "샐러드"
  | "면"
  | "죽"
  | "튀김"
  | "발효"
  | "기타";

// 목표별 하루 칼로리·단백질 가이드라인 (점심+저녁 합산 기준)
export const GOAL_NUTRITION: Record<Goal, { minCalories: number; maxCalories: number; minProtein: number }> = {
  "light-loss":   { minCalories: 400, maxCalories: 650,  minProtein: 30 },
  balanced:       { minCalories: 600, maxCalories: 900,  minProtein: 40 },
  "high-protein": { minCalories: 650, maxCalories: 950,  minProtein: 60 },
};

export interface UserInput {
  period: Period;
  headcount: Headcount;
  goal: Goal;
  mealStyle: MealStyle;
  cookLevel: CookLevel;
  cookTime: CookTime;
  dislikedIngredients: string[];
  allergies: string[];
  // optional
  gender?: Gender;
  ageGroup?: AgeGroup;
  activityLevel?: ActivityLevel;
  weightGoal?: WeightGoal;
  budget?: Budget;
}

export type MealType = "lunch" | "dinner";
export type Category = "korean" | "easy" | "simple";

export interface MenuItem {
  id: string;
  name: string;
  type: "main" | "side";
  category: Category[];
  cookTime: number; // minutes
  cookLevel: "beginner" | "basic";
  mainIngredient: string;
  cookingMethod: CookingMethod;
  familiarityScore: number; // 0-100, 높을수록 친숙한 메뉴
  tags: string[];
  calories?: number; // per serving
  protein?: number;  // grams per serving
  allergens: string[];
  style: MealStyle[];
  goalFit: Goal[];
}

export interface MealSlot {
  id: string;
  main: MenuItem;
  sides: MenuItem[];
}

export interface DayPlan {
  day: number;
  date?: string;
  lunch: MealSlot;
  dinner: MealSlot;
}

export interface MealPlan {
  sessionId: string;
  createdAt: number; // timestamp
  expiresAt: number; // timestamp
  userInput: UserInput;
  days: DayPlan[];
}

export interface GenerateRequest {
  userInput: UserInput;
}

export interface GenerateResponse {
  success: boolean;
  plan?: MealPlan;
  error?: string;
}

export interface ReplaceMealRequest {
  sessionId: string;
  day: number;
  mealType: MealType;
  userInput: UserInput;
  currentPlan: DayPlan[];
}

export interface ReplaceMealResponse {
  success: boolean;
  newMeal?: MealSlot;
  error?: string;
}
