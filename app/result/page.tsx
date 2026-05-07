"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DayPlanCard from "@/components/meal/DayPlanCard";
import AdBanner from "@/components/ads/AdBanner";
import type { MealPlan, DayPlan, MealSlot, MealType } from "@/lib/types";

// 버튼 클릭 시점에 SDK를 on-demand로 로드 — 중복 로드 방지를 위한 싱글턴 프로미스
let kakaoSDKPromise: Promise<void> | null = null;

function loadKakaoSDK(): Promise<void> {
  if (kakaoSDKPromise) return kakaoSDKPromise;
  const existing = (window as unknown as { Kakao?: KakaoSDK }).Kakao;
  if (existing) return Promise.resolve();

  kakaoSDKPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      kakaoSDKPromise = null;
      reject(new Error("Kakao SDK load failed"));
    };
    document.head.appendChild(script);
  });

  return kakaoSDKPromise;
}

const GOAL_LABELS: Record<string, string> = {
  "light-loss": "가볍게 감량",
  balanced: "균형 건강관리",
  "high-protein": "단백질 챙기기",
};

const STYLE_LABELS: Record<string, string> = {
  korean: "한식 위주",
  "korean-easy": "한식+간편식",
  "ultra-simple": "초간단 위주",
};

const GOAL_PHRASE: Record<string, string> = {
  "light-loss": "가볍게 감량하는",
  balanced: "균형 잡힌",
  "high-protein": "단백질을 챙기는",
};

type KakaoShareLink = { mobileWebUrl: string; webUrl: string };
type KakaoSDK = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (opts: {
      objectType: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: KakaoShareLink;
      };
      buttons?: { title: string; link: KakaoShareLink }[];
    }) => void;
  };
};

function WeekTab({
  weeks,
  activeWeek,
  onChange,
}: {
  weeks: number[];
  activeWeek: number;
  onChange: (w: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {weeks.map((w) => (
        <button
          key={w}
          onClick={() => onChange(w)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeWeek === w
              ? "bg-orange-500 text-white shadow"
              : "bg-white border border-gray-200 text-gray-600"
          }`}
        >
          {w}주차
        </button>
      ))}
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session");

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [activeWeek, setActiveWeek] = useState(1);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [savingImage, setSavingImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("잘못된 접근입니다.");
      return;
    }

    const stored = sessionStorage.getItem(`plan-${sessionId}`);
    if (!stored) {
      setError("식단 데이터가 없습니다. 다시 생성해 주세요.");
      return;
    }

    try {
      const parsed: MealPlan = JSON.parse(stored);
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(`plan-${sessionId}`);
        setError("식단이 만료되었습니다. 다시 생성해 주세요.");
        return;
      }
      setPlan(parsed);

      // analytics
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "view_result", {
          period: parsed.userInput.period,
          goal: parsed.userInput.goal,
        });
      }
    } catch {
      setError("식단 데이터를 불러올 수 없습니다.");
    }
  }, [sessionId]);

  const handleReplace = useCallback(
    (day: number, mealType: MealType, newMeal: MealSlot) => {
      setPlan((prev) => {
        if (!prev) return prev;
        const updated: MealPlan = {
          ...prev,
          days: prev.days.map((d) =>
            d.day === day
              ? {
                  ...d,
                  [mealType]: newMeal,
                }
              : d
          ),
        };
        sessionStorage.setItem(`plan-${prev.sessionId}`, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // ── 모든 훅은 early return 이전에 선언 (Rules of Hooks) ──────────────

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;

    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast("링크가 복사됐어요!");
    };

    const onFail = () => {
      showToast("복사에 실패했어요. 주소창에서 직접 복사해 주세요.");
    };

    const execCommandFallback = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? onSuccess() : onFail();
      } catch {
        onFail();
      }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(execCommandFallback);
    } else {
      execCommandFallback();
    }
  }, [showToast]);

  const handleKakaoShare = useCallback(async () => {
    if (!plan) return;

    try {
      await loadKakaoSDK();
    } catch {
      showToast("카카오 SDK를 불러올 수 없습니다. 네트워크를 확인해 주세요.");
      return;
    }

    const kakao = (window as unknown as { Kakao?: KakaoSDK }).Kakao;
    if (!kakao) return;

    if (!kakao.isInitialized()) {
      const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
      if (!appKey) {
        showToast("카카오 앱 키가 설정되지 않았습니다.");
        return;
      }
      kakao.init(appKey);
    }

    const origin = window.location.origin;
    const currentUrl = window.location.href;
    const firstMenu = plan.days[0]?.lunch?.main?.name ?? "";
    const description =
      `${GOAL_LABELS[plan.userInput.goal]} · ${STYLE_LABELS[plan.userInput.mealStyle]}` +
      (firstMenu ? ` · ${firstMenu}` : "");

    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${plan.userInput.period}일 ${plan.userInput.headcount}인 맞춤 식단`,
        description,
        imageUrl: `${origin}/og-image.png`,
        link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
      },
      buttons: [
        { title: "식단 보기",   link: { mobileWebUrl: currentUrl,          webUrl: currentUrl } },
        { title: "나도 만들기", link: { mobileWebUrl: `${origin}/generate`, webUrl: `${origin}/generate` } },
      ],
    });
  }, [plan, showToast]);

  const handleSaveImage = useCallback(async () => {
    if (!plan || !shareCardRef.current) return;
    setSavingImage(true);
    showToast("이미지 생성 중...");

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        x: -8,
        y: -8,
        width: shareCardRef.current.offsetWidth + 16,
        height: shareCardRef.current.offsetHeight + 16,
      });

      const filename = `식단-${plan.userInput.period}일-${plan.userInput.headcount}인.png`;

      if (typeof navigator.canShare === "function") {
        try {
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png");
          });
          const file = new File([blob], filename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: "내 맞춤 식단" });
            showToast("이미지 공유 완료!");
            return;
          }
        } catch {
          // 사용자 취소 또는 공유 실패 → 다운로드로 전환
        }
      }

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("이미지가 저장됐어요!");
    } catch {
      showToast("이미지 저장에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setSavingImage(false);
    }
  }, [plan, showToast]);

  // ── early returns ───────────────────────────────────────────────────

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">😢</div>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => router.push("/generate")}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium"
        >
          다시 식단 만들기
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500">식단을 불러오는 중...</p>
      </div>
    );
  }

  const totalWeeks = Math.ceil(plan.userInput.period / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekDays = plan.days.filter(
    (d) => d.day > (activeWeek - 1) * 7 && d.day <= activeWeek * 7
  );

  const top3Menus = [
    plan.days[0]?.lunch?.main?.name,
    plan.days[0]?.dinner?.main?.name,
    plan.days[1]?.lunch?.main?.name,
  ].filter((n): n is string => Boolean(n));

  const summaryLine = `${GOAL_PHRASE[plan.userInput.goal] ?? ""} ${plan.userInput.period}일 맞춤 식단 (${STYLE_LABELS[plan.userInput.mealStyle]})`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">

      {/* Share card — ref target for image capture */}
      <div ref={shareCardRef} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-300" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">🍴 자동 식단 생성기</span>
            <span className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full font-medium">
              #{plan.userInput.period}일식단
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 leading-tight mb-0.5">
            {plan.userInput.period}일 · {plan.userInput.headcount}인
          </p>
          <p className="text-sm font-medium text-orange-500 mb-4">{summaryLine}</p>

          <div className="border-t border-dashed border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-2">이런 메뉴가 들어 있어요</p>
            <ul className="space-y-1.5">
              {top3Menus.map((name, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span>🥢</span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Share actions */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-500 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-500">복사됨!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              링크 복사
            </>
          )}
        </button>

        <button
          onClick={handleKakaoShare}
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-gray-800 active:scale-95 transition-all"
          style={{ backgroundColor: "#FEE500" }}
        >
          {/* 카카오 말풍선 아이콘 */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.582 2 11c0 2.74 1.612 5.153 4.07 6.674L5.1 21l4.182-2.103A11.7 11.7 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
          </svg>
          카카오 공유
        </button>

        <button
          onClick={handleSaveImage}
          disabled={savingImage}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {savingImage ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              이미지 저장
            </>
          )}
        </button>

        <button
          onClick={() => router.push("/generate")}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          다시 만들기
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🍱</span>
          <h1 className="font-bold text-lg">{plan.userInput.period}일 맞춤 식단</h1>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {plan.userInput.headcount}인
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {GOAL_LABELS[plan.userInput.goal]}
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {STYLE_LABELS[plan.userInput.mealStyle]}
          </span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
            조리 {plan.userInput.cookTime}분 이내
          </span>
        </div>
        <p className="text-orange-100 text-xs mt-3">
          * 건강 참고용 식단이며 의료 조언이 아닙니다. 원하는 끼니는 언제든 교체할 수 있습니다.
        </p>
      </div>

      {/* Week tabs */}
      {totalWeeks > 1 && (
        <div className="mb-4">
          <WeekTab weeks={weeks} activeWeek={activeWeek} onChange={setActiveWeek} />
        </div>
      )}

      {/* Ad - 결과 상단 */}
      <AdBanner format="horizontal" className="mb-6" />

      {/* Day plans */}
      <div className="space-y-4">
        {weekDays.map((dayPlan: DayPlan, idx: number) => (
          <div key={dayPlan.day}>
            <DayPlanCard
              dayPlan={dayPlan}
              userInput={plan.userInput}
              currentPlan={plan.days}
              onReplace={handleReplace}
            />
            {/* Ad 삽입: 3일마다 광고 1회 */}
            {(idx + 1) % 3 === 0 && idx < weekDays.length - 1 && (
              <AdBanner format="rectangle" className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 pb-8">
        <button
          onClick={() => router.push("/generate")}
          className="flex-1 border border-orange-300 text-orange-500 font-medium py-3 rounded-xl"
        >
          새 식단 만들기
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-orange-500 text-white font-medium py-3 rounded-xl shadow"
        >
          저장 / 인쇄
        </button>
      </div>

      {/* Bottom ad */}
      <AdBanner format="horizontal" className="mb-4" />

      {/* Copy toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none">
          {toast.startsWith("링크가") ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast}
        </div>
      )}
    </main>
  );
}

export default function ResultPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        }
      >
        <ResultContent />
      </Suspense>
      <Footer />
    </>
  );
}
