import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * 사이트 공통 Footer
 *
 * - 신뢰 링크(서비스 소개 / 개인정보처리방침 / 이용약관 / 면책 고지 / 문의하기)를 제공합니다.
 * - 문의 이메일을 직접 노출해 운영 중인 서비스임을 명확히 합니다.
 * - 사이트명/저작권/연락처는 모두 `lib/site-config.ts` 단일 소스에서 가져옵니다.
 */

const PRIMARY_LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
  { href: "/disclaimer", label: "면책 고지" },
] as const;

const BLOG_LINKS = [
  { href: "/blog/1in-diet-guide", label: "1인 식단 가이드" },
  { href: "/blog/easy-korean-cooking", label: "쉬운 한식 요리" },
  { href: "/blog/healthy-meal-tips", label: "건강 식단 팁" },
  { href: "/blog/diet-for-weight-loss", label: "다이어트 식단" },
  { href: "/blog/high-protein-meals", label: "고단백 식단" },
  { href: "/blog/meal-prep-tips", label: "밀프렙 가이드" },
  { href: "/blog/budget-cooking", label: "저예산 집밥" },
  { href: "/blog/two-person-cooking", label: "2인 식단 가이드" },
] as const;

function buildCopyrightYears(start: number): string {
  const now = new Date().getFullYear();
  return now > start ? `${start}–${now}` : `${start}`;
}

export default function Footer() {
  const years = buildCopyrightYears(siteConfig.copyrightStartYear);

  return (
    <footer className="bg-white border-t border-gray-100 mt-16 safe-bottom">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 1. 브랜드 + 서비스 안내 */}
        <div className="text-center mb-7">
          <p className="font-bold text-gray-800 text-base">{siteConfig.name}</p>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">
            본 서비스는 일반 건강 참고용 정보를 제공하며,
            <br className="sm:hidden" />
            의료·영양 전문가의 조언을 대체하지 않습니다.
          </p>
        </div>

        {/* 2. 신뢰 링크 (서비스/정책/문의) */}
        <nav
          aria-label="사이트 정보"
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600 mb-6"
        >
          {PRIMARY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 3. 문의 이메일 (운영 사이트 신뢰 신호) */}
        <div className="flex flex-col items-center gap-1 mb-7">
          <span className="text-[11px] text-gray-400">문의</span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-xs font-medium text-gray-700 hover:text-orange-500 transition-colors break-all"
          >
            {siteConfig.contact.email}
          </a>
          <span className="text-[11px] text-gray-400">
            {siteConfig.contact.replyPolicy}
          </span>
        </div>

        {/* 4. 블로그 링크 (보조) */}
        <nav
          aria-label="블로그"
          className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] text-gray-400 mb-6 pt-5 border-t border-gray-100"
        >
          {BLOG_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 5. 저작권 */}
        <p className="text-center text-[11px] text-gray-400">
          © {years} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
