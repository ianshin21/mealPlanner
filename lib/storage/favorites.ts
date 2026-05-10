/**
 * 점심·회식 즐겨찾기 저장소 (localStorage 기반)
 *
 * 저장 키:
 *   "meal-planner:favorites:places" → PlaceFavorite[]   (식당 즐겨찾기)
 *   "meal-planner:favorites:menus"  → MenuStyleFavorite[] (메뉴 스타일 즐겨찾기)
 *
 * PlaceFavorite 는 lunch.ts 의 FavoritePlace 인터페이스 상위 집합이므로
 * recommendLunch / recommendParty 의 favorites 파라미터에 바로 전달 가능.
 */

// ────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────

export type PlaceType = "lunch" | "party";

/** localStorage 에 저장되는 식당 즐겨찾기 항목 */
export interface PlaceFavorite {
  placeId: string;
  placeName: string;
  category: string;
  address: string;
  kakaoMapUrl: string;
  estimatedPricePerPerson?: number;
  type: PlaceType;
  savedAt: number;
}

/** localStorage 에 저장되는 메뉴 스타일 즐겨찾기 항목 */
export interface MenuStyleFavorite {
  style: string;   // e.g. "korean", "meat", "seafood"
  type: PlaceType;
  savedAt: number;
}

/** addPlaceFavorite 호출 시 외부에서 넘기는 데이터 (savedAt 자동 설정) */
export type AddPlaceFavoriteInput = Omit<PlaceFavorite, "savedAt">;

// ────────────────────────────────────────────
// 상수
// ────────────────────────────────────────────

const PLACE_KEY = "meal-planner:favorites:places";
const MENU_KEY  = "meal-planner:favorites:menus";

// ────────────────────────────────────────────
// 내부 헬퍼
// ────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

function readPlaces(): PlaceFavorite[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(PLACE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PlaceFavorite[]) : [];
  } catch {
    return [];
  }
}

function writePlaces(entries: PlaceFavorite[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(PLACE_KEY, JSON.stringify(entries));
  } catch {}
}

function readMenus(): MenuStyleFavorite[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MenuStyleFavorite[]) : [];
  } catch {
    return [];
  }
}

function writeMenus(entries: MenuStyleFavorite[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(MENU_KEY, JSON.stringify(entries));
  } catch {}
}

// ────────────────────────────────────────────
// 식당 즐겨찾기 공개 API
// ────────────────────────────────────────────

/** 전체 즐겨찾기 목록 반환. type 지정 시 해당 타입만 반환 (최신 순) */
export function getPlaceFavorites(type?: PlaceType): PlaceFavorite[] {
  const all = readPlaces();
  const filtered = type ? all.filter((f) => f.type === type) : all;
  return filtered.sort((a, b) => b.savedAt - a.savedAt);
}

/** 즐겨찾기 여부 확인 */
export function isPlaceFavorited(placeId: string, type: PlaceType): boolean {
  return readPlaces().some((f) => f.placeId === placeId && f.type === type);
}

/** 즐겨찾기 추가 (이미 있으면 savedAt 갱신) */
export function addPlaceFavorite(data: AddPlaceFavoriteInput): void {
  const existing = readPlaces().filter(
    (f) => !(f.placeId === data.placeId && f.type === data.type),
  );
  existing.push({ ...data, savedAt: Date.now() });
  writePlaces(existing);
}

/** 즐겨찾기 제거 */
export function removePlaceFavorite(placeId: string, type: PlaceType): void {
  writePlaces(
    readPlaces().filter((f) => !(f.placeId === placeId && f.type === type)),
  );
}

/**
 * 즐겨찾기 토글
 * @returns true = 추가됨, false = 제거됨
 */
export function togglePlaceFavorite(data: AddPlaceFavoriteInput): boolean {
  if (isPlaceFavorited(data.placeId, data.type)) {
    removePlaceFavorite(data.placeId, data.type);
    return false;
  }
  addPlaceFavorite(data);
  return true;
}

// ────────────────────────────────────────────
// 메뉴 스타일 즐겨찾기 공개 API
// ────────────────────────────────────────────

/** 메뉴 스타일 즐겨찾기 목록 반환 */
export function getMenuStyleFavorites(type?: PlaceType): MenuStyleFavorite[] {
  const all = readMenus();
  return type ? all.filter((f) => f.type === type) : all;
}

/** 메뉴 스타일 즐겨찾기 여부 확인 */
export function isMenuStyleFavorited(style: string, type: PlaceType): boolean {
  return readMenus().some((f) => f.style === style && f.type === type);
}

/** 메뉴 스타일 즐겨찾기 추가 */
export function addMenuStyleFavorite(style: string, type: PlaceType): void {
  const existing = readMenus().filter(
    (f) => !(f.style === style && f.type === type),
  );
  existing.push({ style, type, savedAt: Date.now() });
  writeMenus(existing);
}

/** 메뉴 스타일 즐겨찾기 제거 */
export function removeMenuStyleFavorite(style: string, type: PlaceType): void {
  writeMenus(readMenus().filter((f) => !(f.style === style && f.type === type)));
}

/**
 * 메뉴 스타일 즐겨찾기 토글
 * @returns true = 추가됨, false = 제거됨
 */
export function toggleMenuStyleFavorite(style: string, type: PlaceType): boolean {
  if (isMenuStyleFavorited(style, type)) {
    removeMenuStyleFavorite(style, type);
    return false;
  }
  addMenuStyleFavorite(style, type);
  return true;
}

// ────────────────────────────────────────────
// 초기화
// ────────────────────────────────────────────

/** 즐겨찾기 전체 삭제 (type 지정 시 해당 타입만) */
export function clearFavorites(type?: PlaceType): void {
  if (!isClient()) return;
  if (!type) {
    localStorage.removeItem(PLACE_KEY);
    localStorage.removeItem(MENU_KEY);
    return;
  }
  writePlaces(readPlaces().filter((f) => f.type !== type));
  writeMenus(readMenus().filter((f) => f.type !== type));
}
