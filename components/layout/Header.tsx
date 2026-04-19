"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍱</span>
          <span className="font-bold text-gray-900 text-base">자동 식단 생성기</span>
        </Link>
        <Link
          href="/generate"
          className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-full font-medium active:bg-orange-600 transition-colors"
        >
          식단 만들기
        </Link>
      </div>
    </header>
  );
}
