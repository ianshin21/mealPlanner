import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "다이어트 식단 완전 가이드 — 살 빼면서 맛있게 먹는 방법",
  description:
    "굶지 않고 살을 빼는 현실적인 다이어트 식단 방법. 칼로리 계산 없이도 실천 가능한 식단 구성과 추천 메뉴를 알려드립니다.",
  openGraph: {
    title: "다이어트 식단 완전 가이드",
    description: "굶지 않고 살을 빼는 현실적인 식단 방법",
  },
};

export default function DietForWeightLoss() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">다이어트 식단 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          다이어트 식단 완전 가이드
          <br />
          <span className="text-base font-normal text-gray-500">굶지 않고 살 빼는 현실적인 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">왜 다이어트는 항상 실패할까?</h2>
            <p>
              다이어트 실패의 가장 큰 이유는 너무 극단적인 식이 제한에 있습니다.
              하루 1,000kcal 이하로 먹거나 특정 음식군을 완전히 끊으면 처음에는 살이 빠지는 것 같지만,
              결국 반동 식욕(요요)과 함께 다시 원래대로 돌아오게 됩니다.
              지속 가능한 다이어트는 &lsquo;굶는 것&rsquo;이 아니라 &lsquo;잘 먹는 것&rsquo;에서 시작합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 다이어트 식단의 기본 원칙</h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✅ 칼로리 적자 유지 (하루 200~500kcal)</h3>
                <p className="text-xs text-gray-600">
                  지나친 칼로리 제한보다 200~500kcal 적자를 꾸준히 유지하는 것이 요요 없는 감량의 핵심입니다.
                  주당 0.3~0.5kg 감량이 건강한 속도입니다.
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✅ 단백질 충분히 섭취</h3>
                <p className="text-xs text-gray-600">
                  단백질은 포만감을 오래 유지시키고 근육량을 보호합니다.
                  체중(kg) × 1.2~1.5g를 목표로 섭취하세요. (예: 60kg → 하루 72~90g)
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">✅ 가공식품 줄이고 자연식품 위주로</h3>
                <p className="text-xs text-gray-600">
                  과자, 탄산음료, 배달 음식 등 가공식품은 칼로리 대비 포만감이 낮습니다.
                  같은 칼로리라도 채소, 단백질, 통곡물이 더 오래 배를 채워줍니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 다이어트 식단 추천 메뉴</h2>
            <p className="mb-3">칼로리가 낮으면서도 포만감이 높은 메뉴들입니다.</p>
            <div className="space-y-2">
              {[
                { cal: "150kcal", name: "된장찌개 + 나물 1가지", tip: "두부 단백질로 포만감↑" },
                { cal: "180kcal", name: "계란찜 + 김치", tip: "계란 2개로 단백질 14g" },
                { cal: "200kcal", name: "닭가슴살 볶음 + 채소", tip: "고단백 저칼로리의 왕" },
                { cal: "220kcal", name: "오징어볶음 + 밥 반 공기", tip: "해산물로 단백질 보충" },
                { cal: "180kcal", name: "닭가슴살 샐러드", tip: "점심에 가볍게 먹기 좋음" },
                { cal: "100kcal", name: "미역국 + 두부조림", tip: "미역은 칼로리 거의 없음" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-bold text-orange-500 w-20 flex-shrink-0">{item.cal}</span>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 피해야 할 함정</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>과도한 탄수화물 제한:</strong> 뇌와 근육의 주요 에너지원인 탄수화물을 너무 줄이면 집중력 저하, 피로감이 생깁니다.</li>
              <li><strong>식사 거르기:</strong> 한 끼를 거르면 다음 끼니에 과식으로 이어지는 경우가 많습니다.</li>
              <li><strong>운동 후 보상 심리:</strong> &ldquo;운동했으니까 더 먹어도 돼&rdquo;는 생각은 결과적으로 칼로리 적자를 없앱니다.</li>
              <li><strong>저칼로리 라벨 맹신:</strong> &ldquo;다이어트 음식&rdquo;으로 표시된 가공식품도 첨가당이 많을 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 다이어트 중 한 끼 구성법</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-lg mb-1">🍚</div>
                  <div className="font-semibold">탄수화물</div>
                  <div className="text-gray-500 mt-1">밥 반~2/3 공기<br />또는 잡곡밥</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg mb-1">🥩</div>
                  <div className="font-semibold">단백질</div>
                  <div className="text-gray-500 mt-1">닭가슴살·두부·<br />계란·생선</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg mb-1">🥬</div>
                  <div className="font-semibold">채소</div>
                  <div className="text-gray-500 mt-1">나물·무침 등<br />충분히</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 식단 관리를 쉽게 하는 방법</h2>
            <p>
              매 끼니마다 칼로리를 계산하는 것은 현실적으로 오래 유지하기 어렵습니다.
              대신 매주 식단을 미리 계획해두는 것이 훨씬 효과적입니다.
              어떤 메뉴를 먹을지 미리 정해두면 충동적인 배달 주문이나 폭식을 줄일 수 있습니다.
            </p>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-gray-900 mb-2">다이어트 식단 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              &ldquo;가볍게 감량&rdquo; 목표를 선택하면 칼로리가 낮고 단백질이 풍부한 메뉴로
              14일 또는 28일치 식단을 자동으로 구성해 드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              무료 다이어트 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료 조언이 아닙니다. 체중 감량 목표가 있는 경우
            전문 영양사 또는 의사와 상담을 권장합니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
