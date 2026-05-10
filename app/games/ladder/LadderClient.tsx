"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { shareLadder, isKakaoShareAvailable } from "@/lib/share/kakao";
import { trackEvent } from "@/lib/analytics";

function IconKakao({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.68 1.76 5.03 4.42 6.38l-.88 3.28 3.82-2.52A10.9 10.9 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
    </svg>
  );
}

// ── Constants ──────────────────────────────────
const COL_W  = 64;
const PAD_X  = 24;
const ROW_H  = 44;
const N_ROWS = 8;
const NAME_H = 44;
const PRIZE_H = 44;
const GRID_H  = N_ROWS * ROW_H;

const COLORS = [
  "#f97316", "#3b82f6", "#10b981", "#8b5cf6",
  "#ef4444", "#f59e0b", "#06b6d4", "#ec4899",
];

// ── SVG coordinate helpers ─────────────────────
function colX(c: number) { return PAD_X + c * COL_W; }
function gridY(r: number) { return NAME_H + r * ROW_H; }

// ── Ladder generation ──────────────────────────
function generateRungs(n: number): boolean[][] {
  return Array.from({ length: N_ROWS }, () => {
    const row = Array<boolean>(n - 1).fill(false);
    for (let c = 0; c < n - 1; c++) {
      if (!row[c] && (c === 0 || !row[c - 1])) {
        row[c] = Math.random() < 0.45;
      }
    }
    return row;
  });
}

// Returns column index at each level (length = N_ROWS + 1)
function traceCol(start: number, rungs: boolean[][]): number[] {
  let col = start;
  const path = [col];
  for (const row of rungs) {
    if (col < row.length && row[col]) col++;
    else if (col > 0 && row[col - 1]) col--;
    path.push(col);
  }
  return path;
}

function buildPathD(cols: number[]): string {
  let d = `M ${colX(cols[0])} ${gridY(0)}`;
  for (let r = 0; r < cols.length - 1; r++) {
    const x0 = colX(cols[r]);
    const x1 = colX(cols[r + 1]);
    const midY = gridY(r) + ROW_H / 2;
    d += ` L ${x0} ${midY}`;
    if (x0 !== x1) d += ` L ${x1} ${midY}`;
    d += ` L ${x1} ${gridY(r + 1)}`;
  }
  return d;
}

// ── Component ──────────────────────────────────
type Phase = "setup" | "play";

export default function LadderClient() {
  const [phase, setPhase]         = useState<Phase>("setup");
  const [players, setPlayers]     = useState(["", "", ""]);
  const [prizes, setPrizes]       = useState(["", "", ""]);
  const [rungs, setRungs]         = useState<boolean[][]>([]);
  const [results, setResults]     = useState<number[]>([]);
  const [revealed, setRevealed]   = useState(new Set<number>());
  const [animating, setAnimating] = useState<number | null>(null);
  const [copied, setCopied]       = useState(false);

  const n           = players.length;
  const svgW        = PAD_X * 2 + (n - 1) * COL_W;
  const svgH        = NAME_H + GRID_H + PRIZE_H;
  const allRevealed = revealed.size === n;

  // ── Setup helpers ──────────────────────────────
  function setPlayer(i: number, v: string) {
    setPlayers(p => { const a = [...p]; a[i] = v; return a; });
  }
  function setPrize(i: number, v: string) {
    setPrizes(p => { const a = [...p]; a[i] = v; return a; });
  }
  function addPlayer() {
    if (n >= 8) return;
    setPlayers(p => [...p, ""]);
    setPrizes(p  => [...p, ""]);
  }
  function removePlayer(i: number) {
    if (n <= 2) return;
    setPlayers(p => p.filter((_, idx) => idx !== i));
    setPrizes(p  => p.filter((_, idx) => idx !== i));
  }

  // ── Game flow ──────────────────────────────────
  function initGame() {
    const r = generateRungs(n);
    setRungs(r);
    setResults(players.map((_, i) => {
      const path = traceCol(i, r);
      return path[path.length - 1];
    }));
    setRevealed(new Set());
    setAnimating(null);
  }
  function startGame()    { initGame(); setPhase("play"); trackEvent("ladder_start", { players: n }); }
  function reshuffleGame() { initGame(); }

  function handleReveal(i: number) {
    if (revealed.has(i) || animating !== null) return;
    setAnimating(i);
    setTimeout(() => {
      setRevealed(prev => new Set([...prev, i]));
      setAnimating(null);
    }, 800);
  }

  function revealAll() {
    if (animating !== null) return;
    setRevealed(new Set(players.map((_, i) => i)));
  }

  async function handleCopy() {
    const lines = ["사다리타기 결과", "─".repeat(14)];
    players.forEach((name, i) => {
      lines.push(`${name || `참가자${i + 1}`}  →  ${prizes[results[i]] || `항목${results[i] + 1}`}`);
    });
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    trackEvent("kakao_share_click", { page: "ladder" });
    const ladderResults = players.map((name, i) => ({
      name: name || `참가자${i + 1}`,
      prize: prizes[results[i]] || `항목${results[i] + 1}`,
    }));
    if (isKakaoShareAvailable()) {
      shareLadder({ results: ladderResults });
      return;
    }
    if (navigator.share) {
      const text = ["사다리타기 결과", ...ladderResults.map(r => `${r.name} → ${r.prize}`)].join("\n");
      navigator.share({ title: "사다리타기 결과", text, url: window.location.href }).catch(() => {});
    }
  }

  // ── Setup phase ────────────────────────────────
  if (phase === "setup") {
    const canStart = players.every(p => p.trim()) && prizes.every(p => p.trim());
    return (
      <>
        <Header />
        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="mb-4">
            <Link href="/" className="text-xs text-orange-500">홈</Link>
            <span className="text-xs text-gray-300 mx-1">›</span>
            <span className="text-xs text-gray-400">사다리타기</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1">사다리타기</h1>
          <p className="text-sm text-gray-500 mb-6">누가 밥값 낼지, 랜덤으로 정해요.</p>

          <div className="flex gap-2 px-0.5 mb-2">
            <p className="flex-1 text-xs font-semibold text-gray-400">참가자</p>
            <p className="flex-1 text-xs font-semibold text-gray-400">당첨 항목</p>
            <div className="w-8" />
          </div>

          <div className="space-y-2 mb-4">
            {players.map((player, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={player}
                  onChange={(e) => setPlayer(i, e.target.value)}
                  placeholder={`참가자 ${i + 1}`}
                  maxLength={8}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <input
                  type="text"
                  value={prizes[i]}
                  onChange={(e) => setPrize(i, e.target.value)}
                  placeholder={i === 0 ? "당첨" : "꽝"}
                  maxLength={8}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={() => removePlayer(i)}
                  disabled={n <= 2}
                  className="w-8 h-10 flex items-center justify-center text-gray-300 active:text-gray-500 disabled:opacity-20 text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {n < 8 && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 active:bg-gray-50 mb-6"
            >
              + 참가자 추가 ({n}/8)
            </button>
          )}

          <button
            type="button"
            onClick={startGame}
            disabled={!canStart}
            className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-base active:bg-orange-600 disabled:opacity-40"
          >
            사다리 생성
          </button>
          {!canStart && (
            <p className="text-xs text-gray-400 text-center mt-2">이름과 항목을 모두 입력해 주세요.</p>
          )}
        </main>
        <Footer />
      </>
    );
  }

  // ── Play phase ─────────────────────────────────
  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">사다리타기</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">사다리타기</h1>
        <p className="text-sm text-gray-500 mb-5">
          {allRevealed ? "결과가 모두 공개됐어요!" : "이름을 눌러 결과를 확인하세요."}
        </p>

        {/* ── SVG Ladder */}
        <div className="overflow-x-auto -mx-4">
          <div className="px-4" style={{ minWidth: `${svgW + 32}px` }}>
            <svg width={svgW} height={svgH} className="block mx-auto select-none">

              {/* Vertical lines */}
              {players.map((_, i) => (
                <line
                  key={`vl-${i}`}
                  x1={colX(i)} y1={NAME_H}
                  x2={colX(i)} y2={NAME_H + GRID_H}
                  stroke="#e5e7eb" strokeWidth={2.5}
                />
              ))}

              {/* Horizontal rungs */}
              {rungs.flatMap((row, r) =>
                row.map((has, c) =>
                  has ? (
                    <line
                      key={`rg-${r}-${c}`}
                      x1={colX(c)}     y1={gridY(r) + ROW_H / 2}
                      x2={colX(c + 1)} y2={gridY(r) + ROW_H / 2}
                      stroke="#d1d5db" strokeWidth={2.5} strokeLinecap="round"
                    />
                  ) : null
                )
              )}

              {/* Traced paths — visible only when animating or revealed */}
              {players.map((_, i) => {
                const isAnim     = animating === i;
                const isRevealed = revealed.has(i);
                if (!isAnim && !isRevealed) return null;
                const color = COLORS[i % COLORS.length];
                return (
                  <path
                    key={`path-${i}`}
                    d={buildPathD(traceCol(i, rungs))}
                    fill="none"
                    stroke={color}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isAnim ? 0.7 : 1}
                    className={isAnim ? "animate-pulse" : undefined}
                  />
                );
              })}

              {/* Player name buttons */}
              {players.map((name, i) => {
                const isAnim     = animating === i;
                const isRevealed = revealed.has(i);
                const active     = isAnim || isRevealed;
                const color      = COLORS[i % COLORS.length];
                const label      = (name || `참가자${i + 1}`).slice(0, 4);
                return (
                  <g key={`nm-${i}`} onClick={() => handleReveal(i)}
                    style={{ cursor: isRevealed ? "default" : "pointer" }}>
                    {/* Enlarged tap area */}
                    <rect x={colX(i) - 30} y={0} width={60} height={NAME_H} fill="transparent" />
                    <rect
                      x={colX(i) - 26} y={6} width={52} height={32} rx={8}
                      fill={active ? color : "#fff7ed"}
                      stroke={active ? color : "#fed7aa"}
                      strokeWidth={1.5}
                    />
                    <text
                      x={colX(i)} y={27}
                      textAnchor="middle" fontSize={11} fontWeight="700"
                      fill={active ? "#ffffff" : "#c2410c"}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Prize labels */}
              {prizes.map((prize, pi) => {
                const playerIdx  = results.findIndex(result => result === pi);
                const isRevealed = playerIdx >= 0 && revealed.has(playerIdx);
                const color      = playerIdx >= 0 ? COLORS[playerIdx % COLORS.length] : "#d1d5db";
                const label      = (prize || `항목${pi + 1}`).slice(0, 4);
                const pyBase     = NAME_H + GRID_H;
                return (
                  <g key={`pz-${pi}`}>
                    <rect
                      x={colX(pi) - 26} y={pyBase + 6} width={52} height={32} rx={8}
                      fill={isRevealed ? "#ffffff" : "#f9fafb"}
                      stroke={isRevealed ? color : "#e5e7eb"}
                      strokeWidth={1.5}
                    />
                    <text
                      x={colX(pi)} y={pyBase + 27}
                      textAnchor="middle" fontSize={11}
                      fontWeight={isRevealed ? "700" : "400"}
                      fill={isRevealed ? color : "#9ca3af"}
                    >
                      {isRevealed ? label : "?"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-5">
          {!allRevealed ? (
            <button type="button" onClick={revealAll} disabled={animating !== null}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm active:bg-gray-200 disabled:opacity-40">
              전체 공개
            </button>
          ) : (
            <button type="button" onClick={handleCopy}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                copied ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600 active:bg-orange-200"
              }`}>
              {copied ? "복사됨 ✓" : "결과 복사"}
            </button>
          )}
          <button type="button" onClick={reshuffleGame} disabled={animating !== null}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm active:bg-gray-50 disabled:opacity-40">
            다시 생성
          </button>
          <button type="button" onClick={() => setPhase("setup")}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm active:bg-gray-50">
            처음부터
          </button>
        </div>

        {/* Share button — visible only after all revealed */}
        {allRevealed && (
          <div className="mt-2">
            <button type="button" onClick={handleShare}
              className="w-full flex items-center justify-center gap-1.5 bg-[#FEE500] text-gray-900 font-semibold text-sm py-3 rounded-xl active:opacity-70">
              <IconKakao className="w-4 h-4" />
              카카오 공유
            </button>
          </div>
        )}

        {/* Results summary */}
        {allRevealed && (
          <div className="mt-6">
            <div className="h-px bg-gray-100 mb-4" />
            <p className="text-xs font-semibold text-gray-400 mb-3 tracking-wide uppercase">결과 요약</p>
            <div className="space-y-2">
              {players.map((name, i) => {
                const prizeIdx = results[i];
                const color    = COLORS[i % COLORS.length];
                return (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-semibold text-sm text-gray-900 flex-1">
                      {name || `참가자${i + 1}`}
                    </span>
                    <span className="text-gray-300 text-sm">→</span>
                    <span className="font-bold text-sm" style={{ color }}>
                      {prizes[prizeIdx] || `항목${prizeIdx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
