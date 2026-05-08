import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "요리 초보용 쉬운 집밥 메뉴 기준 — 실패 없는 집밥 고르는 법",
  description:
    "요리를 처음 시작하는 분을 위한 집밥 메뉴 선정 기준. 재료 2~3가지, 20분 이내, 실패 없는 메뉴를 고르는 기준과 실전 목록을 정리했습니다.",
  openGraph: {
    title: "요리 초보용 쉬운 집밥 메뉴 기준",
    description: "실패 없이 집밥을 시작하는 메뉴 선정 기준",
  },
};

export default function BlogBeginnerHomeCooking() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">요리 초보용 집밥 메뉴</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          요리 초보용 쉬운 집밥 메뉴 기준
          <br />
          <span className="text-base font-normal text-gray-500">실패 없는 메뉴를 고르는 3가지 기준</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">왜 '쉬운 메뉴'를 먼저 골라야 하나</h2>
            <p>
              요리 초보가 식단 짜기에서 가장 많이 실수하는 부분은 너무 어려운 메뉴를 첫날부터 계획하는 것입니다.
              한 번 실패하면 귀찮아지고, 결국 배달이나 편의식으로 돌아가게 됩니다.
              시작은 무조건 쉬운 메뉴여야 합니다. 쉬운 메뉴로 자신감을 쌓고 나면,
              자연스럽게 더 다양한 요리에 도전하게 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">쉬운 집밥을 고르는 3가지 기준</h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">기준 1. 주재료가 2~3가지 이내</h3>
                <p>
                  재료가 많으면 손질 시간이 늘어나고 조리 순서가 복잡해집니다.
                  초보에게 적합한 메뉴는 주재료 2~3가지로 완성되는 요리입니다.
                  계란+김치, 두부+간장, 돼지고기+김치처럼 단순한 조합이 좋습니다.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">기준 2. 조리 시간 20분 이내</h3>
                <p>
                  초보에게 오래 걸리는 요리는 중간에 타거나 실수할 가능성이 높아집니다.
                  20분 이내로 완성되는 요리는 집중력이 흐트러지기 전에 끝낼 수 있어서
                  성공률이 훨씬 높습니다.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">기준 3. 온도 조절이 크게 필요 없는 요리</h3>
                <p>
                  초보가 가장 어려워하는 부분이 불 조절입니다. 중불로 계속 볶으면 되는
                  볶음 요리나, 물에 넣고 끓이면 되는 찌개류는 불 조절 실수가 치명적이지 않아
                  초보에게 적합합니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">초보에게 추천하는 집밥 메뉴 목록</h2>
            <div className="space-y-2">
              {[
                { category: "계란 요리", menus: ["계란프라이 + 간장", "스크램블에그", "계란말이", "계란국"] },
                { category: "찌개·국", menus: ["김치찌개 (캔 참치 활용)", "순두부찌개 (소스 팩 활용)", "미역국", "계란국"] },
                { category: "볶음 요리", menus: ["김치볶음밥", "참치마요덮밥", "어묵볶음", "감자볶음"] },
                { category: "간단 반찬", menus: ["시금치나물 (냉동)", "콩나물무침", "두부조림", "김구이"] },
              ].map((cat) => (
                <div key={cat.category} className="border border-gray-100 rounded-xl p-3">
                  <div className="font-semibold text-sm text-orange-600 mb-2">{cat.category}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.menus.map((m) => (
                      <span key={m} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">초보가 꼭 피해야 할 메뉴 유형</h2>
            <div className="space-y-2">
              {[
                { menu: "튀김 요리", reason: "기름 온도 조절이 어렵고 화상 위험 있음. 에어프라이어가 있다면 도전 가능" },
                { menu: "조림 요리 (장조림 등)", reason: "오래 졸여야 해서 시간 예측이 어렵고 타기 쉬움" },
                { menu: "전·부침개류", reason: "뒤집는 타이밍 맞추기가 어렵고, 기름이 튐" },
                { menu: "재료 10가지 이상 레시피", reason: "손질·계량 부담이 커서 완성 전에 지치기 쉬움" },
              ].map((item) => (
                <div key={item.menu} className="flex gap-3 bg-red-50 rounded-xl p-3">
                  <span className="text-red-400 font-bold flex-shrink-0 text-sm">✕</span>
                  <div>
                    <div className="font-semibold text-sm text-red-700">{item.menu}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">초보 집밥 성공을 위한 필수 도구</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>계량스푼·계량컵:</strong> 간을 감으로 맞추면 실패 확률이 높아집니다. 처음엔 계량이 필수.</li>
              <li><strong>타이머:</strong> 볶음·찌개 등 타이밍이 중요한 요리에 필수.</li>
              <li><strong>코팅 프라이팬 (28cm):</strong> 눌어붙음 없이 대부분의 볶음·구이 요리 가능.</li>
              <li><strong>뚜껑 있는 냄비:</strong> 찌개, 국, 밥 모두 이 하나로 해결.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">초보 식단 짜기 3단계 전략</h2>
            <div className="space-y-2">
              {[
                { step: "1단계", title: "2주는 같은 메뉴 반복", desc: "같은 메뉴를 반복하면서 손에 익히기. 실수 줄이기에 집중." },
                { step: "2단계", title: "주 1가지씩 새 메뉴 추가", desc: "익숙해지면 매주 한 가지씩 새 메뉴 도전. 실패해도 나머지 메뉴가 있으니 부담 없음." },
                { step: "3단계", title: "재료 응용 시작", desc: "같은 재료로 다른 요리 만들기 시작. 닭→닭볶음탕→닭죽 식으로 응용 범위 확장." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <span className="w-16 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </span>
                  <div className="bg-gray-50 rounded-xl p-3 flex-1">
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">초보 맞춤 식단을 자동으로 만들어 드립니다</h2>
            <p className="text-sm text-gray-600 mb-4">
              요리 수준(완전 초보 / 기본 가능)을 선택하면 해당 수준에 맞는 메뉴로만 식단을 구성합니다.
              조리 시간도 10분·20분·30분 중 선택할 수 있어 실력에 맞게 조절할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              초보 맞춤 식단 만들기 →
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
