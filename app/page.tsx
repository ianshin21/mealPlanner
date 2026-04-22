import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "자동 식단 생성기 | 1인·2인 가정을 위한 14·28일 식단",
};

const FEATURES = [
  { icon: "⚡", title: "회원가입 없이 바로 시작", desc: "가입 없이 즉시 사용 가능" },
  { icon: "🍽️", title: "14일 또는 28일 식단", desc: "점심과 저녁만 간단하게" },
  { icon: "🔄", title: "끼니별 교체 가능", desc: "마음에 안 들면 해당 끼니만 바꾸기" },
  { icon: "📱", title: "모바일 최적화", desc: "스마트폰에서 편하게 확인" },
];

const STEPS = [
  { num: "1", title: "조건 선택", desc: "기간, 인원, 목표, 식사 스타일 등 간단히 입력" },
  { num: "2", title: "자동 생성", desc: "AI가 아닌 검증된 알고리즘으로 즉시 생성" },
  { num: "3", title: "식단 확인", desc: "날짜별 점심·저녁 식단 한눈에 보기" },
  { num: "4", title: "교체·저장", desc: "마음에 안 드는 끼니만 교체, 스크린샷으로 저장" },
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4">
        {/* Hero */}
        <section className="py-12 text-center">
          <div className="text-6xl mb-4">🍱</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            매일 &quot;오늘 뭐 먹지?&quot;
            <br />
            고민 끝!
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            1인·2인 가정을 위한 14일·28일 식단을
            <br />
            입력 몇 번으로 자동으로 만들어 드립니다.
            <br />
            <span className="text-orange-500 font-medium">회원가입 없이 바로 사용 가능.</span>
          </p>
          <Link
            href="/generate"
            className="inline-block bg-orange-500 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-lg active:bg-orange-600 transition-colors"
          >
            무료로 식단 만들기
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            * 이 서비스는 일반 건강 참고용이며 의료 조언이 아닙니다.
          </p>
        </section>

        {/* Ad slot 1 - hero 하단 */}
        <AdBanner format="horizontal" className="mb-8" />

        {/* Features */}
        <section className="py-8">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            이런 분께 딱 맞아요
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="font-semibold text-sm text-gray-900">{f.title}</div>
                <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Target audience */}
        <section className="py-8 bg-orange-50 rounded-2xl px-6 my-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">이런 상황에 유용해요</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              "혼자 살면서 매번 뭐 먹을지 고민되는 분",
              "2인 가족인데 식단 계획 세우기 귀찮은 분",
              "다이어트 중인데 식단 짜기 막막한 분",
              "요리 초보라 쉬운 메뉴가 필요한 분",
              "1주일치 장 볼 때 뭘 사야 할지 모르는 분",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="py-8">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">
            사용 방법
          </h2>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{step.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-bold px-8 py-3 rounded-xl shadow active:bg-orange-600 transition-colors"
            >
              지금 바로 시작하기 →
            </Link>
          </div>
        </section>

        {/* Ad slot 2 - 중간 */}
        <AdBanner format="rectangle" className="my-8" />

        {/* SEO content links */}
        <section className="py-8 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-700 mb-4">식단 관련 정보</h2>
          <div className="space-y-3">
            <Link
              href="/blog/1in-diet-guide"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">1인 가정 식단 완전 가이드</div>
              <div className="text-sm text-gray-500 mt-1">혼자 사는 분을 위한 실용적인 식단 관리 방법</div>
            </Link>
            <Link
              href="/blog/easy-korean-cooking"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">요리 초보도 쉽게 만드는 한식 20선</div>
              <div className="text-sm text-gray-500 mt-1">20분 이내 완성, 재료 3가지로 만드는 집밥</div>
            </Link>
            <Link
              href="/blog/healthy-meal-tips"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">바쁜 직장인을 위한 건강 식단 팁</div>
              <div className="text-sm text-gray-500 mt-1">시간 없어도 균형 잡힌 식사를 하는 방법</div>
            </Link>
            <Link
              href="/blog/diet-for-weight-loss"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">굶지 않고 살 빼는 다이어트 식단 가이드</div>
              <div className="text-sm text-gray-500 mt-1">칼로리 계산 없이 건강하게 체중 감량하는 방법</div>
            </Link>
            <Link
              href="/blog/high-protein-meals"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">고단백 식단 완전 가이드</div>
              <div className="text-sm text-gray-500 mt-1">근육 키우고 체력 관리하는 단백질 중심 식단</div>
            </Link>
            <Link
              href="/blog/meal-prep-tips"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">밀프렙 완전 가이드</div>
              <div className="text-sm text-gray-500 mt-1">주말 2시간으로 일주일 식사 해결하는 방법</div>
            </Link>
            <Link
              href="/blog/budget-cooking"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">한 끼 3천원 이하 저예산 집밥 가이드</div>
              <div className="text-sm text-gray-500 mt-1">식비 절약하면서 건강하게 먹는 알뜰 레시피</div>
            </Link>
            <Link
              href="/blog/two-person-cooking"
              className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div className="font-medium text-gray-900">2인 가정 식단 가이드</div>
              <div className="text-sm text-gray-500 mt-1">재료 낭비 없이 둘이 먹기 딱 좋은 식단 노하우</div>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-6">
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-500">안내사항:</strong> 본 서비스의 식단 정보는 일반 건강 참고용으로 제공되며,
            의사, 영양사 등 전문가의 의료·영양 조언을 대체하지 않습니다.
            특정 질환이 있거나 전문적인 식이 관리가 필요한 경우 반드시 전문가와 상담하세요.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
