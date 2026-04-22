import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 py-8 safe-bottom">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center text-sm text-gray-500 space-y-4">
          <p className="font-semibold text-gray-700">자동 식단 생성기</p>
          <p className="text-xs leading-relaxed">
            본 서비스는 일반 건강 참고용 정보를 제공하며, 의료·영양 전문가의 조언을 대체하지 않습니다.
          </p>

          {/* 주요 링크 */}
          <div className="flex flex-wrap justify-center gap-4 text-xs pt-1">
            <Link href="/about" className="hover:text-orange-500 transition-colors">
              서비스 소개
            </Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">
              문의하기
            </Link>
            <Link href="/privacy" className="hover:text-orange-500 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">
              이용약관
            </Link>
            <Link href="/disclaimer" className="hover:text-orange-500 transition-colors">
              면책 고지
            </Link>
          </div>

          {/* 블로그 링크 */}
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/blog/1in-diet-guide" className="hover:text-orange-500 transition-colors">
              1인 식단 가이드
            </Link>
            <Link href="/blog/easy-korean-cooking" className="hover:text-orange-500 transition-colors">
              쉬운 한식 요리
            </Link>
            <Link href="/blog/healthy-meal-tips" className="hover:text-orange-500 transition-colors">
              건강 식단 팁
            </Link>
            <Link href="/blog/diet-for-weight-loss" className="hover:text-orange-500 transition-colors">
              다이어트 식단
            </Link>
            <Link href="/blog/high-protein-meals" className="hover:text-orange-500 transition-colors">
              고단백 식단
            </Link>
            <Link href="/blog/meal-prep-tips" className="hover:text-orange-500 transition-colors">
              밀프렙 가이드
            </Link>
            <Link href="/blog/budget-cooking" className="hover:text-orange-500 transition-colors">
              저예산 집밥
            </Link>
            <Link href="/blog/two-person-cooking" className="hover:text-orange-500 transition-colors">
              2인 식단 가이드
            </Link>
          </div>

          <p className="text-xs text-gray-400 pt-1">© 2025 자동 식단 생성기. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
