"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { shareSplit, isKakaoShareAvailable } from "@/lib/share/kakao";
import { trackEvent } from "@/lib/analytics";

// ────────────────────────────────────────────
// 타입
// ────────────────────────────────────────────
type RoundUnit = 1 | 10 | 100 | 1000;

const ROUND_LABELS: Record<RoundUnit, string> = {
  1:    "원단위",
  10:   "10원",
  100:  "100원",
  1000: "1,000원",
};

// ────────────────────────────────────────────
// 계산 헬퍼
// ────────────────────────────────────────────

/** n명으로 나누고 unit 단위로 올림 */
function perPerson(amount: number, n: number, unit: RoundUnit): number {
  if (n <= 0 || amount <= 0) return 0;
  const exact = amount / n;
  if (unit === 1) return Math.ceil(exact);
  return Math.ceil(exact / unit) * unit;
}

function formatWon(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

function formatInput(n: number): string {
  return n === 0 ? "" : n.toLocaleString("ko-KR");
}

function parseInput(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits === "" ? 0 : Math.min(parseInt(digits, 10), 99_999_999);
}

// ────────────────────────────────────────────
// 복사용 텍스트 생성
// ────────────────────────────────────────────
interface CopyTextParams {
  total: number;
  headcount: number;
  totalPerPerson: number;
  separateAlcohol: boolean;
  foodAmount: number;
  foodPerPerson: number;
  alcoholAmount: number;
  alcoholPerPerson: number;
  roundUnit: RoundUnit;
  totalCollected: number;
}

function buildCopyText(p: CopyTextParams): string {
  const roundNote = p.roundUnit === 1 ? "원단위" : `${p.roundUnit.toLocaleString()}원 단위 올림`;
  const excess = p.totalCollected - p.total;

  const lines: string[] = [
    "더치페이 계산 결과",
    "─".repeat(20),
    `총 금액  ${formatWon(p.total)}`,
    `인원     ${p.headcount}명`,
    `1인당    ${formatWon(p.totalPerPerson)}  (${roundNote})`,
  ];

  if (p.separateAlcohol && p.alcoholAmount > 0) {
    lines.push("");
    lines.push(`  음식값  ${formatWon(p.foodPerPerson)}`);
    lines.push(`  술값    ${formatWon(p.alcoholPerPerson)}`);
  }

  if (excess > 0) {
    lines.push("");
    lines.push(`총 걷는 금액 ${formatWon(p.totalCollected)} (${formatWon(excess)} 남음)`);
  }

  return lines.join("\n");
}

// ────────────────────────────────────────────
// 서브 컴포넌트
// ────────────────────────────────────────────

function AmountInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
          ₩
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formatInput(value)}
          onChange={(e) => onChange(parseInput(e.target.value))}
          placeholder={placeholder ?? "0"}
          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function HeadcountInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(50, value + 1));

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">인원 수</label>
      <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={dec}
          disabled={value <= 1}
          className="w-12 h-12 text-xl font-light text-gray-500 active:bg-gray-100 disabled:opacity-30 flex-shrink-0"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/[^0-9]/g, "") || "1", 10);
              onChange(Math.max(1, Math.min(50, n)));
            }}
            className="w-full text-center text-base font-bold text-gray-900 py-3 focus:outline-none bg-transparent"
          />
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= 50}
          className="w-12 h-12 text-xl font-light text-gray-500 active:bg-gray-100 disabled:opacity-30 flex-shrink-0"
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">최대 50명</p>
    </div>
  );
}

function IconKakao({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.68 1.76 5.03 4.42 6.38l-.88 3.28 3.82-2.52A10.9 10.9 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
    </svg>
  );
}

function chip(active: boolean) {
  return active
    ? "px-3 py-1.5 rounded-xl text-sm font-semibold bg-orange-500 text-white"
    : "px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 active:bg-gray-50";
}

// ────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────
export default function SplitClient() {
  const [total, setTotal]               = useState(0);
  const [headcount, setHeadcount]       = useState(2);
  const [roundUnit, setRoundUnit]       = useState<RoundUnit>(100);
  const [separateAlcohol, setSeparate]  = useState(false);
  const [alcohol, setAlcohol]           = useState(0);
  const [copied, setCopied]             = useState(false);
  const [linkCopied, setLinkCopied]     = useState(false);

  // ── 파생 계산
  const food = separateAlcohol ? Math.max(0, total - alcohol) : total;
  const n    = Math.max(1, headcount);

  const foodPP    = perPerson(food, n, roundUnit);
  const alcoholPP = separateAlcohol ? perPerson(alcohol, n, roundUnit) : 0;
  const totalPP   = separateAlcohol ? foodPP + alcoholPP : perPerson(total, n, roundUnit);
  const collected = totalPP * n;
  const excess    = collected - total;

  const hasResult = total > 0;
  const alcoholExceedsTotal = separateAlcohol && alcohol > total;

  // 첫 유효 결과 표시 시 1회 추적
  const calcTracked = useRef(false);
  useEffect(() => {
    if (hasResult && !calcTracked.current) {
      calcTracked.current = true;
      trackEvent("split_calculate", { headcount: n });
    }
  }, [hasResult, n]);

  // ── 카카오 공유 (SDK 미준비 시 Web Share API 폴백)
  const handleKakaoShare = () => {
    trackEvent("kakao_share_click", { page: "split" });
    const showSplit = separateAlcohol && alcohol > 0 && !alcoholExceedsTotal;
    if (isKakaoShareAvailable()) {
      shareSplit({
        total,
        headcount: n,
        perPerson: totalPP,
        roundUnit,
        separateAlcohol: showSplit,
        foodPerPerson:    showSplit ? foodPP    : undefined,
        alcoholPerPerson: showSplit ? alcoholPP : undefined,
        totalCollected:   excess > 0 ? collected : undefined,
      });
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: "더치페이 계산 결과",
        text: buildCopyText({
          total, headcount: n, totalPerPerson: totalPP,
          separateAlcohol, foodAmount: food, foodPerPerson: foodPP,
          alcoholAmount: alcohol, alcoholPerPerson: alcoholPP,
          roundUnit, totalCollected: collected,
        }),
        url: window.location.href,
      }).catch(() => {});
    }
  };

  // ── 링크 복사
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // ── 텍스트 복사
  const handleCopy = async () => {
    const text = buildCopyText({
      total,
      headcount: n,
      totalPerPerson: totalPP,
      separateAlcohol,
      foodAmount: food,
      foodPerPerson: foodPP,
      alcoholAmount: alcohol,
      alcoholPerPerson: alcoholPP,
      roundUnit,
      totalCollected: collected,
    });
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* 브레드크럼 */}
        <div className="mb-4">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">1/N 계산기</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">1/N 계산기</h1>
        <p className="text-sm text-gray-500 mb-6">점심값·회식비·술값을 인원 수로 나눠 드려요.</p>

        <div className="space-y-5">

          {/* ── 총 금액 */}
          <AmountInput
            label="총 금액"
            value={total}
            onChange={setTotal}
            placeholder="120,000"
            hint="음식값 + 술값 합산을 입력하세요"
          />

          {/* ── 인원 수 */}
          <HeadcountInput value={headcount} onChange={setHeadcount} />

          {/* ── 반올림 단위 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">올림 단위</label>
            <p className="text-xs text-gray-400 mb-2">1인당 금액을 해당 단위로 올림 처리해요</p>
            <div className="flex flex-wrap gap-2">
              {([1, 10, 100, 1000] as RoundUnit[]).map((u) => (
                <button key={u} type="button" onClick={() => setRoundUnit(u)} className={chip(roundUnit === u)}>
                  {ROUND_LABELS[u]}
                </button>
              ))}
            </div>
          </div>

          {/* ── 술값 분리 */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-semibold text-gray-700">술값 별도 분리</p>
                <p className="text-xs text-gray-400">음식값과 술값을 각각 계산해요</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSeparate((v) => !v);
                  if (!separateAlcohol) setAlcohol(0);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  separateAlcohol ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    separateAlcohol ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {separateAlcohol && (
              <div className="mt-3">
                <AmountInput
                  label="술값"
                  value={alcohol}
                  onChange={setAlcohol}
                  placeholder="30,000"
                />
                {alcoholExceedsTotal && (
                  <p className="text-xs text-red-500 mt-1">술값이 총 금액을 초과했어요.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ────────────────── 결과 ────────────────── */}
        {hasResult && (
          <div className="mt-8">
            <div className="h-px bg-gray-100 mb-6" />

            {/* 메인 결과 */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 mb-4">
              <p className="text-xs font-semibold text-orange-400 mb-1 tracking-wide uppercase">
                결과
              </p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {totalPP.toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-gray-600">원</span>
                <span className="text-sm text-gray-400 ml-1">/ 1인</span>
              </div>

              {/* 올림 잔액 */}
              {excess > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  총 걷는 금액 {collected.toLocaleString()}원
                  <span className="text-gray-300 mx-1.5">·</span>
                  {excess.toLocaleString()}원 남음
                </p>
              )}

              {/* 술값 분리 상세 */}
              {separateAlcohol && alcohol > 0 && !alcoholExceedsTotal && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-orange-100">
                  <div>
                    <p className="text-xs text-gray-400">음식값</p>
                    <p className="text-base font-semibold text-gray-800">
                      {foodPP.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-gray-200 self-center text-lg">+</div>
                  <div>
                    <p className="text-xs text-gray-400">술값</p>
                    <p className="text-base font-semibold text-gray-800">
                      {alcoholPP.toLocaleString()}원
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 계산 요약 줄 */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                총 {total.toLocaleString()}원
              </span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                {n}명
              </span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                {ROUND_LABELS[roundUnit]} 올림
              </span>
            </div>

            {/* 복사용 텍스트 박스 */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-500">카카오톡 전달용 텍스트</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                    copied
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600 active:bg-orange-200"
                  }`}
                >
                  {copied ? "복사됨 ✓" : "복사하기"}
                </button>
              </div>
              <pre className="px-4 py-3 text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap bg-white">
                {buildCopyText({
                  total,
                  headcount: n,
                  totalPerPerson: totalPP,
                  separateAlcohol,
                  foodAmount: food,
                  foodPerPerson: foodPP,
                  alcoholAmount: alcohol,
                  alcoholPerPerson: alcoholPP,
                  roundUnit,
                  totalCollected: collected,
                })}
              </pre>
            </div>

            {/* 공유 버튼 행 */}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleKakaoShare}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#FEE500] text-gray-900 font-semibold text-sm py-3 rounded-xl active:opacity-70"
              >
                <IconKakao className="w-4 h-4" />
                카카오 공유
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  linkCopied
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600 active:bg-gray-200"
                }`}
              >
                {linkCopied ? "복사됨 ✓" : "링크 복사"}
              </button>
            </div>
          </div>
        )}

        {/* 빈 상태 안내 */}
        {!hasResult && (
          <div className="mt-10 text-center text-gray-300">
            <div className="text-4xl mb-2">🧮</div>
            <p className="text-sm">총 금액을 입력하면 바로 계산돼요</p>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
