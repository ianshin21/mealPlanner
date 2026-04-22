import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "2인 가정 식단 가이드 — 둘이서 건강하게 먹는 방법",
  description:
    "2인 가정만의 식단 고민을 해결해 드립니다. 재료 낭비 없이 둘이 먹기 딱 좋은 요리법과 2인 식단 구성 노하우를 알려드립니다.",
  openGraph: {
    title: "2인 가정 식단 가이드",
    description: "둘이서 건강하게 먹는 식단 관리 방법",
  },
};

export default function TwoPersonCooking() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">2인 가정 식단 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          2인 가정 식단 가이드
          <br />
          <span className="text-base font-normal text-gray-500">둘이서 건강하고 맛있게 먹는 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2인 가정의 식사 고민</h2>
            <p>
              1인보다는 낫지만, 2인도 나름의 식사 고민이 있습니다.
              마트에서 파는 재료는 대부분 4인 기준으로 포장되어 있어 2인이 다 먹기엔 너무 많고,
              그렇다고 소량씩 사면 비쌉니다. 또한 두 사람의 입맛이 다를 때 메뉴 선정도 쉽지 않습니다.
              이런 2인 가정만의 고민을 현실적으로 해결하는 방법을 알아봅니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 2인 식단의 핵심 원칙</h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">재료 효율적으로 쓰기</h3>
                <p className="text-xs text-gray-600">
                  500g 돼지고기를 사면 200g은 제육볶음, 나머지 300g은 김치찌개에 넣는 식으로
                  같은 재료를 여러 요리에 나눠 쓰면 낭비가 없습니다.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">냉동 보관 적극 활용</h3>
                <p className="text-xs text-gray-600">
                  고기류는 1회분(150~200g)씩 소분해 냉동하면 필요할 때마다 꺼내 사용할 수 있습니다.
                  냉동 전에 미리 양념해두면 조리 시간도 단축됩니다.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">서로 다른 입맛 조율하기</h3>
                <p className="text-xs text-gray-600">
                  공통으로 좋아하는 음식 위주로 주 3~4회, 각자 원하는 메뉴를 1~2회 번갈아 먹으면
                  만족도가 높은 식단을 유지할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 2인분 만들기 딱 좋은 메뉴</h2>
            <div className="space-y-2">
              {[
                { name: "된장찌개", tip: "두부 반 모 + 된장 = 2인분 딱 맞음. 국물 요리는 2인이 가장 효율적" },
                { name: "제육볶음", tip: "돼지 목살 300g이면 2인분. 고기는 한 번에 사서 반은 냉동 보관" },
                { name: "닭볶음탕", tip: "닭 반 마리(약 600g)면 2인 충분. 남은 건 다음날 도시락으로 활용" },
                { name: "소고기 미역국", tip: "소고기 150g으로 2인분 국 가능. 미역은 냉동 보관 용이" },
                { name: "계란찜", tip: "계란 4개면 2인분. 조리 시간 15분, 누구나 만들 수 있음" },
                { name: "참치김치찌개", tip: "참치캔 1개 + 김치로 2인분. 가장 간단하고 경제적인 찌개" },
              ].map((item) => (
                <div key={item.name} className="bg-white border border-gray-100 rounded-xl p-3">
                  <div className="font-medium text-sm">{item.name}</div>
                  <p className="text-xs text-gray-500 mt-1">{item.tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 2인 주간 장보기 가이드</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">점심·저녁 7일치 기준 (14끼)</p>
              <div className="space-y-1 text-sm">
                {[
                  { category: "주식", items: "쌀 2kg, 라면 2봉" },
                  { category: "단백질", items: "계란 1판, 돼지고기 600g, 두부 2모, 참치캔 3개" },
                  { category: "채소·반찬", items: "김치 1kg, 시금치 300g, 콩나물 400g, 오이 2개" },
                  { category: "양념류", items: "된장, 고추장, 간장 (기존 것 활용)" },
                ].map((row) => (
                  <div key={row.category} className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-orange-600 w-16 flex-shrink-0">{row.category}</span>
                    <span className="text-gray-600">{row.items}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-600 font-medium mt-3">예상 식재료비: 약 45,000~55,000원/주</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 맞벌이 부부를 위한 빠른 요리 루틴</h2>
            <p className="mb-3">퇴근 후 30분 이내에 2인 저녁을 차리는 방법입니다.</p>
            <div className="space-y-2">
              {[
                { step: "밥통 예약", time: "아침 출근 전", desc: "출근 전 밥솥 예약을 맞춰두면 귀가 시 밥이 완성되어 있습니다." },
                { step: "국 데우기", time: "귀가 직후 5분", desc: "미리 만들어둔 국이나 찌개를 냄비에 올립니다." },
                { step: "반찬 꺼내기", time: "동시", desc: "냉장 보관 반찬은 그냥 꺼내서 담으면 됩니다." },
                { step: "신선 반찬 1가지", time: "15~20분", desc: "계란프라이, 두부구이 등 빠른 반찬 하나만 추가로 만듭니다." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{item.step} <span className="text-xs text-gray-400 font-normal">— {item.time}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 2인 식단에서 흔한 실수</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>한 사람만 요리하다 보면 지치게 됩니다. 역할을 나눠 함께 준비하는 것이 지속 가능합니다.</li>
              <li>외식이 잦아지면 식비가 급격히 증가합니다. 주 2회 이하로 외식을 제한하는 목표를 세워보세요.</li>
              <li>두 사람의 입맛 차이를 무시하고 한쪽 메뉴만 계속 먹으면 갈등의 원인이 됩니다.</li>
              <li>냉장고에 식재료가 쌓이도록 방치하면 결국 낭비로 이어집니다. 주 1회 냉장고를 정리하는 습관을 들이세요.</li>
            </ul>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-gray-900 mb-2">2인 맞춤 식단 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              인원을 &ldquo;2인&rdquo;으로 설정하면 두 사람에게 적합한 메뉴로 14일·28일 식단을 자동 구성해 드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              2인 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료 조언이 아닙니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
