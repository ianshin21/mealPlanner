import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "서비스 소개 | 자동 식단 생성기",
  description:
    "자동 식단 생성기는 1인·2인 가정을 위해 만들어진 무료 식단 계획 도구입니다. 가입 없이 14일·28일 맞춤 식단을 즉시 생성할 수 있습니다.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">서비스 소개</h1>
        <p className="text-sm text-gray-500 mb-8">자동 식단 생성기에 대해 알려드립니다</p>

        {/* 서비스 철학 */}
        <section className="bg-orange-50 rounded-2xl p-6 mb-6">
          <div className="text-4xl mb-3">🍱</div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            "매일 뭐 먹지?"를 해결하는 서비스
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            자동 식단 생성기는 혼자 또는 둘이 사는 분들이 매일 반복되는
            식사 고민을 줄일 수 있도록 만든 무료 도구입니다.
            회원가입 없이 몇 가지 조건만 선택하면 14일 또는 28일치 점심·저녁 식단을
            즉시 생성해 드립니다.
          </p>
        </section>

        {/* 왜 만들었나 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">왜 이 서비스를 만들었나요?</h2>
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              1인 가구가 늘어나면서 "오늘 뭐 먹지?"는 하루 중 가장 피곤한 질문 중 하나가 됐습니다.
              배달 앱은 비싸고, 매번 요리하기는 귀찮고, 식단을 직접 짜는 건 더 어렵습니다.
            </p>
            <p>
              전문 영양사나 비싼 식단 관리 앱 없이도, 누구나 쉽게 현실적인 식단을 가질 수 있어야 한다고
              생각했습니다. 그래서 초보자도 만들 수 있는 한식 위주 메뉴를 중심으로,
              알레르기·비선호 재료·조리 시간까지 고려한 맞춤 식단을 자동으로 만들어주는 서비스를
              개발했습니다.
            </p>
          </div>
        </section>

        {/* 핵심 특징 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">핵심 특징</h2>
          <div className="space-y-3">
            {[
              {
                icon: "🆓",
                title: "완전 무료, 회원가입 없음",
                desc: "개인정보 없이 즉시 사용 가능합니다. 데이터는 브라우저에만 저장됩니다.",
              },
              {
                icon: "🤖",
                title: "rule-based 알고리즘",
                desc: "같은 재료·조리법 반복을 피하고, 친숙한 메뉴를 우선 배치하는 검증된 로직으로 식단을 생성합니다.",
              },
              {
                icon: "🔄",
                title: "끼니별 교체",
                desc: "마음에 들지 않는 끼니는 한 번의 탭으로 바로 교체할 수 있습니다.",
              },
              {
                icon: "🎯",
                title: "목표별 맞춤",
                desc: "가볍게 감량, 균형 건강관리, 단백질 챙기기 — 목표에 따라 메뉴 구성이 달라집니다.",
              },
              {
                icon: "📱",
                title: "모바일 최적화",
                desc: "스마트폰에서 편하게 확인하고 스크린샷으로 저장할 수 있습니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 메뉴 데이터 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">메뉴 데이터에 대해</h2>
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              현재 60가지 이상의 메인 메뉴와 30가지 이상의 반찬 메뉴를 보유하고 있습니다.
              모든 메뉴는 1인·2인 가정에서 현실적으로 조리 가능한 것들로 구성되어 있으며,
              각 메뉴에는 조리 시간, 칼로리, 단백질, 주재료, 알레르기 정보가 포함됩니다.
            </p>
            <p>
              메뉴는 지속적으로 업데이트될 예정이며, 사용자의 피드백을 반영해 개선해 나갈 계획입니다.
            </p>
          </div>
        </section>

        {/* 주의 사항 */}
        <section className="bg-yellow-50 rounded-xl p-4 mb-8 text-xs text-gray-600 leading-relaxed">
          <strong className="text-gray-700">안내사항:</strong> 본 서비스가 제공하는 식단 정보는
          일반 건강 참고용으로, 의사·영양사 등 전문가의 의료·영양 조언을 대체하지 않습니다.
          특정 질환이 있거나 전문적인 식이 관리가 필요한 경우 반드시 전문가와 상담하세요.
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/generate"
            className="inline-block bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg"
          >
            지금 바로 식단 만들기 →
          </Link>
          <p className="text-xs text-gray-400 mt-3">무료 · 가입 불필요</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
