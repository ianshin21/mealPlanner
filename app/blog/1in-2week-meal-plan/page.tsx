import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "1인 가구 2주 식단 짜는 법 — 혼자 살아도 균형 잡힌 식단 만들기",
  description:
    "1인 가구를 위한 2주(14일) 식단 계획 방법. 재료 낭비 없이 점심·저녁을 구성하는 구체적인 방법과 실전 팁을 정리했습니다.",
  openGraph: {
    title: "1인 가구 2주 식단 짜는 법",
    description: "혼자 살아도 균형 잡힌 14일 식단 만드는 방법",
  },
};

export default function Blog1in2weekMealPlan() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">1인 가구 2주 식단</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          1인 가구 2주 식단 짜는 법
          <br />
          <span className="text-base font-normal text-gray-500">재료 낭비 없이 14일을 채우는 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">왜 2주 단위로 짜는 게 유리한가</h2>
            <p>
              1인 가구에게 1주일 식단은 너무 짧아서 매주 다시 계획해야 하고, 한 달은 너무 길어서 실천이 어렵습니다.
              2주(14일) 단위는 냉장고 재료 소진 주기와 딱 맞아떨어지고, 장보기를 두 번으로 나눌 수 있어
              식재료 낭비도 최소화됩니다. 또한 첫 주에 익힌 메뉴를 둘째 주에 약간 변형해서 활용하면
              조리 시간이 점점 줄어드는 효과도 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1단계: 기본 식재료 목록 정하기</h2>
            <p className="mb-3">
              2주 식단을 짜기 전에 냉장고에 항상 있어야 할 기본 재료를 정해두면 훨씬 수월합니다.
            </p>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">🥚 단백질 기본 재료</h3>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>계란 10~15개 — 볶음밥, 계란말이, 국 등 활용도 최고</li>
                  <li>두부 1~2모 — 찌개, 두부조림, 부침으로 다양하게</li>
                  <li>냉동 닭가슴살 또는 닭다리 — 주 2~3회 단백질 보충</li>
                  <li>캔 참치 2~3캔 — 5분 요리의 구세주</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">🥬 채소 기본 재료</h3>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>대파, 양파, 마늘 — 대부분의 찌개·볶음 요리에 기본</li>
                  <li>냉동 시금치·브로콜리 — 손질 없이 바로 사용 가능</li>
                  <li>김치 — 국, 볶음, 찌개에 두루 활용</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">🍚 탄수화물 기본 재료</h3>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>쌀 (혼합 잡곡 추천) — 기본 주식</li>
                  <li>냉동밥 또는 즉석밥 2~3개 — 급할 때 대비</li>
                  <li>라면·소면 — 간단한 끼니용</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2단계: 2주 식단 구성 원칙</h2>
            <p className="mb-3">
              무작정 14일을 채우려 하면 중반에 지칩니다. 아래 원칙을 지키면 실천 가능한 식단이 됩니다.
            </p>
            <div className="space-y-2">
              {[
                { title: "찌개·국은 주 2회", desc: "한 냄비로 2~3끼 해결. 김치찌개, 된장찌개, 순두부찌개 순으로 교대" },
                { title: "볶음은 주 3회", desc: "제육볶음, 참치볶음, 감자볶음 등 재료 교체로 다양하게" },
                { title: "생선·구이는 주 1~2회", desc: "고등어구이, 삼치구이 등 단백질 변화를 주기 위해" },
                { title: "간단 덮밥 주 2회", desc: "참치마요, 계란덮밥 등으로 10분 안에 해결하는 여유 날 배치" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-orange-500 font-bold flex-shrink-0">✓</span>
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3단계: 1주·2주 연계 전략</h2>
            <p className="mb-3">
              1주차에 만든 반찬을 2주차에 응용하면 조리 시간이 절반으로 줍니다.
            </p>
            <div className="space-y-2">
              {[
                { week1: "제육볶음 (양념 돼지고기)", week2: "볶음밥 재료로 활용" },
                { week1: "닭볶음탕 (닭 많이 삶기)", week2: "닭고기 살 발라서 샐러드·덮밥용" },
                { week1: "감자조림 (넉넉하게)", week2: "남은 감자 된장찌개에 투입" },
              ].map((item) => (
                <div key={item.week1} className="grid grid-cols-2 gap-2">
                  <div className="bg-orange-50 rounded-lg p-3 text-xs">
                    <div className="font-medium text-orange-700 mb-1">1주차</div>
                    {item.week1}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs">
                    <div className="font-medium text-gray-600 mb-1">2주차 활용</div>
                    {item.week2}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4단계: 식단 유지를 위한 현실적인 팁</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>월요일에 일주일치 미리 계획:</strong> 메모 앱이나 냉장고에 붙여두면
                매일 고민하지 않아도 됩니다.
              </li>
              <li>
                <strong>피로한 날은 간단 메뉴로:</strong> 평일 중 1~2일은 처음부터 간단한
                메뉴(즉석밥+계란프라이 등)로 배정해두면 지치지 않습니다.
              </li>
              <li>
                <strong>주말에 반찬 몰아 만들기:</strong> 주말 1시간 투자로 평일 식사 준비
                시간을 5~10분으로 줄일 수 있습니다.
              </li>
              <li>
                <strong>식단 완성에 집착하지 않기:</strong> 계획이 틀어지는 날이 생겨도
                다음 날부터 다시 시작하면 됩니다.
              </li>
            </ul>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">14일 식단을 자동으로 만들어 드립니다</h2>
            <p className="text-sm text-gray-600 mb-4">
              위 원칙을 직접 적용하기 번거롭다면 자동 식단 생성기를 활용해보세요.
              1인 / 목표 / 식사 스타일을 선택하면 14일 또는 28일치 식단이 즉시 생성됩니다.
              마음에 안 드는 끼니는 버튼 한 번으로 교체할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              무료로 2주 식단 만들기 →
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
