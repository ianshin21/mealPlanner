import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "고단백 식단 가이드 — 근육 키우고 체력 관리하는 식사법",
  description:
    "근육량을 늘리고 체력을 키우려는 분을 위한 고단백 식단 가이드. 단백질이 풍부한 한식 메뉴와 하루 식단 구성 방법을 알아보세요.",
  openGraph: {
    title: "고단백 식단 가이드",
    description: "근육 키우고 체력 관리하는 고단백 한식 식사법",
  },
};

export default function HighProteinMeals() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">고단백 식단 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          고단백 식단 가이드
          <br />
          <span className="text-base font-normal text-gray-500">근육 키우고 체력 관리하는 식사법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">단백질이 왜 중요한가?</h2>
            <p>
              단백질은 근육, 피부, 머리카락, 호르몬 등 신체 구성의 핵심 영양소입니다.
              운동을 하는 사람뿐 아니라, 바쁜 직장인이나 중장년층에게도 충분한 단백질 섭취는
              체력 유지와 면역력 강화에 매우 중요합니다.
              문제는 한국인의 평균 식단에서 단백질이 부족한 경우가 많다는 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 하루 단백질 섭취 목표</h2>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                {[
                  { label: "일반 성인 (건강 유지)", amount: "체중(kg) × 0.8g", example: "60kg → 48g/일" },
                  { label: "운동 시작 초보", amount: "체중(kg) × 1.2g", example: "60kg → 72g/일" },
                  { label: "근력 운동 활발히 하는 분", amount: "체중(kg) × 1.5~2.0g", example: "60kg → 90~120g/일" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b border-orange-100 last:border-0">
                    <div>
                      <div className="font-medium">{row.label}</div>
                      <div className="text-xs text-gray-500">{row.amount}</div>
                    </div>
                    <div className="text-xs text-orange-600 font-medium">{row.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 단백질 많은 한식 재료</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { food: "닭가슴살 100g", protein: "31g", cal: "165kcal" },
                { food: "소고기 우둔 100g", protein: "22g", cal: "150kcal" },
                { food: "계란 1개", protein: "7g", cal: "78kcal" },
                { food: "두부 100g", protein: "8g", cal: "80kcal" },
                { food: "고등어 100g", protein: "22g", cal: "250kcal" },
                { food: "참치캔 1개(100g)", protein: "24g", cal: "130kcal" },
                { food: "돼지 안심 100g", protein: "22g", cal: "143kcal" },
                { food: "오징어 100g", protein: "18g", cal: "90kcal" },
              ].map((item) => (
                <div key={item.food} className="bg-white border border-gray-100 rounded-lg p-3">
                  <div className="font-medium text-xs">{item.food}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-green-600 font-bold">단백질 {item.protein}</span>
                    <span className="text-xs text-gray-400">{item.cal}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 고단백 한식 추천 메뉴</h2>
            <div className="space-y-2">
              {[
                { name: "닭가슴살 야채볶음", protein: "30g", tip: "채소와 함께 볶아 영양 균형↑" },
                { name: "제육볶음 + 밥", protein: "22g", tip: "돼지 목살로 단백질+철분 보충" },
                { name: "소고기 미역국", protein: "14g", tip: "국물 요리로 단백질과 수분 동시에" },
                { name: "계란찜 + 두부조림", protein: "21g", tip: "두 가지 식물성·동물성 단백질 조합" },
                { name: "고등어구이 + 밥", protein: "22g", tip: "오메가3까지 챙기는 건강 메뉴" },
                { name: "불고기 + 콩나물 밥", protein: "24g", tip: "간편하면서 단백질 풍부" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-bold text-green-600 w-16 flex-shrink-0">단백질 {item.protein}</span>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 하루 고단백 식단 예시</h2>
            <div className="space-y-3">
              {[
                {
                  meal: "점심",
                  menu: "닭가슴살 볶음 + 현미밥 + 시금치나물 + 김치",
                  protein: "약 35g",
                  cal: "약 450kcal",
                },
                {
                  meal: "저녁",
                  menu: "소고기 미역국 + 밥 + 두부구이 + 멸치볶음",
                  protein: "약 28g",
                  cal: "약 500kcal",
                },
              ].map((item) => (
                <div key={item.meal} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">{item.meal}</span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-green-600 font-medium">단백질 {item.protein}</span>
                      <span className="text-gray-400">{item.cal}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{item.menu}</p>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center">하루 합계: 단백질 약 63g · 약 950kcal (점심+저녁 기준)</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 고단백 식단 유지 팁</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>냉동 닭가슴살 비축:</strong> 냉동 상태로 구매해 필요할 때마다 꺼내 사용하면 편리합니다.</li>
              <li><strong>계란을 적극 활용:</strong> 계란은 가성비 최고의 단백질 식품입니다. 삶거나 볶아서 매 끼니 활용하세요.</li>
              <li><strong>단백질 반찬 대량 조리:</strong> 닭가슴살 볶음이나 계란말이를 한 번에 많이 만들어두면 편합니다.</li>
              <li><strong>두부를 빠지지 않게:</strong> 두부조림, 두부구이, 된장찌개 두부 등 다양하게 활용할 수 있습니다.</li>
            </ul>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-gray-900 mb-2">고단백 식단 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              &ldquo;단백질 챙기기&rdquo; 목표를 선택하면 단백질이 풍부한 메뉴 위주로
              14일·28일치 식단을 자동으로 구성해 드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              고단백 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료 조언이 아닙니다.
            신장 질환 등 특정 건강 상태에서 고단백 식이는 주의가 필요합니다.
            전문가와 상담 후 실천하세요.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
