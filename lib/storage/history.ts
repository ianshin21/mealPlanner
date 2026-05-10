/**
 * 점심·회식 추천 이력 저장소 (localStorage 기반)
 *
 * 저장 구조:
 *   "meal-planner:history:lunch" → HistoryEntry[]
 *   "meal-planner:history:party" → HistoryEntry[]
 *
 * 보존 정책:
 *   - 항목 최대 보존 기간: 30일 (이후 자동 정리)
 *   - 중복 판정 윈도우: 7일 또는 14일 (DedupPeriod)
 *   - 동일 placeId 재방문 시 selectedAt 갱신 (이력 최신화)
 */

// ────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────

export type PlaceType = "lunch" | "party";

/** lunch.ts / party.ts 의 DedupPeriod 와 동일한 리터럴 유니언 */
export type DedupPeriod = "none" | "7d" | "14d";

/** localStorage 에 저장되는 이력 항목 */
export interface HistoryEntry {
  placeId: string;
  placeName: string;
  menuKeyword: string;  // 선택 당시 메뉴 키워드 (예: "고기", "한식")
  type: PlaceType;
  selectedAt: number;   // Unix timestamp (ms)
}

/** addEntry 호출 시 외부에서 넘기는 데이터 (selectedAt 은 자동 설정) */
export type AddEntryInput = Omit<HistoryEntry, "selectedAt">;

// ────────────────────────────────────────────
// 상수
// ────────────────────────────────────────────

const STORAGE_KEY: Record<PlaceType, string> = {
  lunch: "meal-planner:history:lunch",
  party: "meal-planner:history:party",
};

/** 30일 이상 된 항목은 자동 정리 */
const MAX_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

const DEDUP_WINDOW_MS: Record<DedupPeriod, number> = {
  none: 0,
  "7d":  7  * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
};

// ────────────────────────────────────────────
// 내부 헬퍼
// ────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

function readRaw(type: PlaceType): HistoryEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY[type]);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeRaw(type: PlaceType, entries: HistoryEntry[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY[type], JSON.stringify(entries));
  } catch {
    // localStorage 용량 초과 또는 사용 불가 — 조용히 무시
  }
}

function evictOld(entries: HistoryEntry[], now: number): HistoryEntry[] {
  const cutoff = now - MAX_RETENTION_MS;
  return entries.filter((e) => e.selectedAt >= cutoff);
}

// ────────────────────────────────────────────
// 공개 API
// ────────────────────────────────────────────

/**
 * 추천 선택 이력을 저장한다.
 *
 * - 같은 placeId 가 이미 있으면 selectedAt·menuKeyword 를 갱신한다.
 * - 저장 후 30일 초과 항목을 자동 정리한다.
 */
export function addEntry(data: AddEntryInput): void {
  const now = Date.now();
  const entry: HistoryEntry = { ...data, selectedAt: now };

  const existing = readRaw(data.type).filter((e) => e.placeId !== data.placeId);
  existing.push(entry);

  writeRaw(data.type, evictOld(existing, now));
}

/**
 * 특정 타입의 전체 이력을 반환한다 (오래된 항목 포함).
 * 오름차순 정렬 (오래된 것 → 최신 것).
 */
export function getHistory(type: PlaceType): HistoryEntry[] {
  return readRaw(type).sort((a, b) => a.selectedAt - b.selectedAt);
}

/**
 * DedupPeriod 윈도우 안에 포함된 이력만 반환한다.
 * lunch.ts / party.ts 의 history 파라미터로 바로 넘길 수 있다.
 *
 * period === "none" 이면 빈 배열 반환 (중복 제거 비활성).
 */
export function getRecentHistory(
  type: PlaceType,
  period: DedupPeriod,
): HistoryEntry[] {
  if (period === "none") return [];
  const cutoff = Date.now() - DEDUP_WINDOW_MS[period];
  return readRaw(type).filter((e) => e.selectedAt >= cutoff);
}

/**
 * 특정 식당이 지정 기간 내 방문 이력이 있는지 확인한다.
 *
 * @returns period === "none" 이면 항상 false
 */
export function isDuplicate(
  placeId: string,
  type: PlaceType,
  period: DedupPeriod,
): boolean {
  if (period === "none") return false;
  const cutoff = Date.now() - DEDUP_WINDOW_MS[period];
  return readRaw(type).some(
    (e) => e.placeId === placeId && e.selectedAt >= cutoff,
  );
}

/**
 * 30일 초과 항목을 수동으로 정리한다.
 * type 을 지정하지 않으면 lunch·party 모두 정리한다.
 */
export function cleanupOldEntries(type?: PlaceType): void {
  const now = Date.now();
  const targets: PlaceType[] = type ? [type] : ["lunch", "party"];
  for (const t of targets) {
    writeRaw(t, evictOld(readRaw(t), now));
  }
}

/**
 * 이력을 전부 삭제한다 (테스트·초기화용).
 * type 을 지정하지 않으면 lunch·party 모두 삭제한다.
 */
export function clearHistory(type?: PlaceType): void {
  if (!isClient()) return;
  const targets: PlaceType[] = type ? [type] : ["lunch", "party"];
  for (const t of targets) {
    localStorage.removeItem(STORAGE_KEY[t]);
  }
}
