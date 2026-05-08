import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "장보기 쉬운 식단 구성법 — 재료 5가지로 일주일 식사 해결하기",
  description:
    "장을 자주 보지 않아도 되는 식단 구성 방법. 재료 중복 활용, 냉동 재료 전략, 소용량 구매 요령까지 장보기가 쉬워지는 식단 짜기 노하우를 정리했습니다.",
  openGraph: {
    title: "장보기 쉬운 식단 구성법",
    description: "재료 5가지로 일주일 식사를 해결하는 방법",
  },
};

export default function BlogEasyGroceryMealPlan() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">장보기 쉬운 식단 구성법</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          장보기 쉬운 식단 구성법
          <br />
          <span className="text-base font-normal text-gray-500">재료 낭비 없이 식단과 장보기를 함께 설계하기</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">식단 짜기와 장보기는 같이 설계해야 한다</h2>
            <p>
              많은 분이 식단을 먼저 짜고 장보기 목록을 만드는 방식으로 접근합니다.
              그런데 이 방식은 메뉴마다 다른 재료가 필요해서 장보기 목록이 길어지고,
              남은 재료들이 냉장고에서 시들어갑니다.
              반대로 &quot;어떤 재료를 살 건지&quot;를 먼저 정하고 그 재료로 메뉴를 짜면
              장보기가 훨씬 단순해지고 낭비도 줄어듭니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 재료 중심 식단 설계 방법</h2>
            <p className="mb-3">
              먼저 이번 주에 살 주재료 3~4가지를 정합니다. 그리고 각 재료를 2~3가지 요리에 활용하는 방식으로 메뉴를 구성합니다.
            </p>
            <div className="space-y-3">
              {[
                {
                  ingredient: "돼지고기 앞다리살 500g",
                  dishes: ["제육볶음", "돼지고기 된장찌개 (남은 것 활용)", "볶음밥 재료"],
                  color: "bg-red-50",
                },
                {
                  ingredient: "두부 2모",
                  dishes: ["순두부찌개", "두부조림", "두부구이 (반찬)"],
                  color: "bg-yellow-50",
                },
                {
                  ingredient: "계란 10개",
                  dishes: ["계란말이", "계란국", "볶음밥 재료", "계란프라이"],
                  color: "bg-orange-50",
                },
                {
                  ingredient: "김치 (상시 구비)",
                  dishes: ["김치찌개", "김치볶음밥", "제육볶음 곁들임"],
                  color: "bg-green-50",
                },
              ].map((item) => (
                <div key={item.ingredient} className={`rounded-xl p-4 ${item.color}`}>
                  <div className="font-semibold text-sm mb-2">{item.ingredient}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.dishes.map((d) => (
                      <span key={d} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 장보기 횟수를 줄이는 냉동 재료 전략</h2>
            <p className="mb-3">
              냉동 보관이 가능한 식재료를 기본으로 구비해두면 장 보는 횟수를 주 1회 이하로 줄일 수 있습니다.
            </p>
            <div className="space-y-2">
              {[
                { item: "냉동 브로콜리·시금치", tip: "해동 없이 바로 국·볶음에 투입 가능" },
                { item: "냉동 닭가슴살·닭다리", tip: "200g씩 소분 냉동해두면 필요할 때마다 꺼내 사용" },
                { item: "냉동밥", tip: "즉석밥보다 저렴하고, 전자레인지 3분이면 완성" },
                { item: "두부 (냉동 보관 가능)", tip: "냉동 후 해동하면 식감이 변해 조림·찌개에 더 잘 어울림" },
                { item: "어묵·어묵볶음 재료", tip: "냉동 상태로 오래 보관 가능하고 빠른 반찬 조리에 활용" },
              ].map((row) => (
                <div key={row.item} className="flex gap-3 bg-blue-50 rounded-xl p-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">❄</span>
                  <div>
                    <div className="font-medium text-sm">{row.item}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{row.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 장보기 목록 작성 요령</h2>
            <p className="mb-3">
              장보기 목록은 &quot;구역별&quot;로 정리하면 마트에서 이리저리 이동하는 시간이 줄어듭니다.
            </p>
            <div className="space-y-2">
              {[
                { zone: "육류·수산 코너", items: "돼지고기, 닭, 생선 (이번 주 계획된 것만)" },
                { zone: "냉동 코너", items: "브로콜리·시금치·콩 등 냉동 채소, 어묵" },
                { zone: "냉장 코너", items: "두부, 계란, 김치, 된장" },
                { zone: "채소 코너", items: "대파, 양파, 마늘 (주 1회 구매로 충분)" },
                { zone: "마른 재료", items: "쌀, 라면, 참치캔 (월 1~2회 대량 구매)" },
              ].map((row) => (
                <div key={row.zone} className="flex gap-3 border border-gray-100 rounded-xl p-3">
                  <span className="text-orange-500 font-bold text-xs flex-shrink-0 pt-0.5">📍</span>
                  <div>
                    <div className="font-semibold text-sm">{row.zone}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{row.items}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 재료 낭비 제로를 위한 규칙</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>새 재료 구매 전 냉장고 확인 필수:</strong> 장 보러 가기 전에 냉장고 사진을 찍어두면
                마트에서 중복 구매를 막을 수 있습니다.
              </li>
              <li>
                <strong>채소는 소분 후 냉장:</strong> 대파·시금치 등은 사자마자 한 끼 분량으로 소분해 냉장하면
                오래 신선하게 유지됩니다.
              </li>
              <li>
                <strong>남은 재료로 끝내는 날 지정:</strong> 주 1회 &quot;냉장고 비우기 날&quot;을 만들어
                남은 재료를 볶음밥이나 된장찌개로 소진합니다.
              </li>
              <li>
                <strong>소스·양념 표준화:</strong> 간장·참기름·고추장·된장·설탕·식초 6가지면
                대부분의 한식 요리를 만들 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 일주일 장보기 예시 목록 (1인 기준)</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {[
                "돼지고기 앞다리 300g",
                "계란 10개",
                "두부 1~2모",
                "대파 1단",
                "양파 2~3개",
                "냉동 브로콜리 1봉",
                "김치 (있으면 생략)",
                "캔 참치 2개",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 border border-gray-300 rounded flex-shrink-0" />
                  {item}
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">
                * 쌀·간장·된장·고추장 등 소스류는 별도 상시 구비
              </p>
            </div>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">장보기까지 고려한 식단을 자동으로 만들어 드립니다</h2>
            <p className="text-sm text-gray-600 mb-4">
              식사 스타일과 조리 시간을 선택하면 재료 중복을 최소화한 방식으로 14일·28일 식단을 자동 구성합니다.
              마음에 안 드는 끼니는 버튼 한 번으로 교체할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              장보기 쉬운 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료·영양 전문가의 조언을 대체하지 않습니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
