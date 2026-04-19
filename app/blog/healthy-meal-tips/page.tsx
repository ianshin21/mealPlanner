import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "바쁜 직장인을 위한 건강 식단 팁 — 시간 없어도 균형 잡힌 식사",
  description:
    "바쁜 일상에서도 건강한 식사를 유지하는 방법. 간단한 준비와 효율적인 식단 관리로 영양 균형을 챙기는 실용 팁을 소개합니다.",
  openGraph: {
    title: "바쁜 직장인을 위한 건강 식단 팁",
    description: "시간 없어도 균형 잡힌 식사를 하는 방법",
  },
};

export default function HealthyMealTips() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">건강한 식단 팁</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          바쁜 직장인을 위한 건강 식단 팁
          <br />
          <span className="text-base font-normal text-gray-500">시간 없어도 균형 잡힌 식사를 하는 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <p>
              바쁜 직장 생활 중에도 건강한 식사를 유지하는 것은 장기적인 건강과 업무 효율에
              큰 영향을 미칩니다. 완벽한 식단보다 꾸준히 유지 가능한 식습관이 더 중요합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 미리 준비하는 밀 프렙(Meal Prep)</h2>
            <p className="mb-3">
              주말 1~2시간을 활용해 한 주 반찬을 미리 만들어두면 평일 조리 시간을 10분 이내로 줄일 수 있습니다.
            </p>
            <div className="space-y-2">
              {[
                { item: "계란 삶기", count: "10~12개", note: "5~7일 보관 가능" },
                { item: "닭가슴살 삶기", count: "300~500g", note: "4~5일 보관, 다양하게 활용" },
                { item: "콩나물무침", count: "한 봉지", note: "3~4일 보관" },
                { item: "시금치나물", count: "한 봉지", note: "3일 보관" },
              ].map((r) => (
                <div key={r.item} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">{r.item}</span>
                    <span className="text-gray-500 ml-2">{r.count}</span>
                  </div>
                  <span className="text-xs text-gray-400">{r.note}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 점심 식단 전략</h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">🏢 사무실 근처 식당 활용</h3>
                <p className="text-xs">
                  한식 백반집, 국밥집 등 한국 식당은 단품보다 영양 균형이 잘 맞는 편입니다.
                  반찬을 골고루 먹는 습관을 들이세요.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">🥡 도시락 지참</h3>
                <p className="text-xs">
                  전날 저녁 먹고 남은 반찬 + 밥으로 간단히 만들 수 있습니다.
                  비용 절약과 영양 관리에 모두 효과적입니다.
                </p>
              </div>
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 저녁 식단 효율화</h2>
            <p className="mb-3">
              퇴근 후 30분 이내에 저녁을 차릴 수 있는 빠른 메뉴를 준비해두세요.
            </p>
            <div className="space-y-2">
              {[
                { title: "원팬 요리", desc: "볶음밥, 제육볶음 — 프라이팬 하나로 완성, 설거지 최소화" },
                { title: "냉동 식품 활용", desc: "냉동 만두, 냉동 채소 — 급할 때 10분 완성 가능" },
                { title: "국물 요리", desc: "찌개 한 그릇에 단백질+채소 모두 담기. 만들기도 쉬움" },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 건강한 식습관 기본 원칙</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>규칙적인 식사 시간:</strong> 점심과 저녁 시간을 일정하게 유지하면
                식욕 조절에 도움이 됩니다.
              </li>
              <li>
                <strong>채소 먼저 먹기:</strong> 식사 순서를 채소 → 단백질 → 탄수화물 순으로
                하면 혈당 조절에 도움이 됩니다.
              </li>
              <li>
                <strong>적정 수분 섭취:</strong> 식사 전 물 한 잔이 과식 예방에 도움이 됩니다.
              </li>
              <li>
                <strong>야식 줄이기:</strong> 저녁 9시 이후 식사는 수면의 질에 영향을 줄 수 있습니다.
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">
              * 위 내용은 일반 건강 참고 정보입니다. 개인 건강 상태에 따라 다를 수 있으며 전문가와 상담하세요.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 외식할 때 건강하게 선택하기</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3">
                <div className="font-semibold text-sm text-green-700 mb-1">✓ 추천 선택</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>· 한식 백반 (반찬 포함)</li>
                  <li>· 국밥류 (돌솥비빔밥)</li>
                  <li>· 쌈밥 (채소 포함)</li>
                  <li>· 해물 요리</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <div className="font-semibold text-sm text-red-600 mb-1">⚠️ 주의 선택</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>· 튀김 위주 메뉴</li>
                  <li>· 고열량 분식류</li>
                  <li>· 과도한 나트륨</li>
                  <li>· 음료수 함께 주문</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">14·28일 식단 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              이런 팁을 반영한 균형 잡힌 식단을 자동으로 생성해드립니다. 조리 시간, 목표, 취향을 선택하면 바로 완성.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              무료로 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료·영양 조언이 아닙니다. 특정 건강 상태가 있는 경우 전문가와 상담하세요.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
