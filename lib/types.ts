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
