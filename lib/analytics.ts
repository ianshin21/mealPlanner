const ANON_ID_KEY = "meal-planner:anon-id";

function getOrCreateAnonId(): string {
  try {
    const existing = localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
    return id;
  } catch {
    return "anon";
  }
}

export type EventName =
  | "landing_view"
  | "generate_start"
  | "generate_complete"
  | "return_visit";

export interface EventProps {
  [key: string]: string | number | boolean | undefined;
}

/**
 * 익명 세션 ID를 붙여 이벤트를 기록한다.
 * - GA4가 설정된 경우 gtag로 전달
 * - 개발 환경에서는 console.log로 확인 가능
 * - 추후 Mixpanel / PostHog 등 어댑터를 이 함수 내부에 추가하면 된다
 */
export function trackEvent(name: EventName, props?: EventProps): void {
  if (typeof window === "undefined") return;

  const anonId = getOrCreateAnonId();

  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", { event: name, anonId, timestamp: Date.now(), ...props });
  }

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (w.gtag) {
    w.gtag("event", name, { anon_id: anonId, ...props });
  }
}
