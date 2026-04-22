import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "한 끼 3천원 이하 — 저렴하게 건강 집밥 먹는 법",
  description:
    "식비 부담 없이 건강하게 먹는 방법. 한 끼 3천원 이하로 만들 수 있는 저렴하고 영양 있는 집밥 레시피와 장보기 노하우를 알려드립니다.",
  openGraph: {
    title: "한 끼 3천원 이하 저렴한 집밥 가이드",
    description: "식비 절약하면서 건강하게 먹는 방법",
  },
};

export default function BudgetCooking() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">저예산 집밥 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          한 끼 3천원 이하 집밥 가이드
          <br />
          <span className="text-base font-normal text-gray-500">저렴하게 건강하게 먹는 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">식비가 부담스러운 분들을 위해</h2>
            <p>
              물가 상승으로 배달 음식 한 끼가 1만 원을 훌쩍 넘는 시대입니다.
              하지만 적은 식비로도 충분히 영양 있고 맛있는 집밥을 만들 수 있습니다.
              핵심은 가성비 좋은 식재료를 중심으로 식단을 짜는 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 가성비 최고 식재료 TOP 10</h2>
            <div className="space-y-2">
              {[
                { name: "계란 (30개 한 판)", price: "약 5,000~6,000원", use: "30일 이상 사용 가능. 볶음, 국, 반찬 등 만능 재료" },
                { name: "두부 (1모 300g)", price: "약 1,000~1,500원", use: "찌개, 조림, 볶음 다양하게 활용" },
                { name: "콩나물 (400g)", price: "약 900~1,200원", use: "국, 무침, 밥에 활용. 조리 시간 5분" },
                { name: "냉동 시금치 (500g)", price: "약 2,000~3,000원", use: "나물, 된장찌개 재료로 오래 사용" },
                { name: "참치캔 (150g 1개)", price: "약 1,500~2,000원", use: "덮밥, 볶음밥, 샐러드에 즉시 활용" },
                { name: "김치 (500g)", price: "약 3,000~4,000원", use: "찌개, 볶음, 반찬으로 1~2주 사용" },
              ].map((item) => (
                <div key={item.name} className="bg-white border border-gray-100 rounded-xl p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="text-xs text-orange-600 font-bold flex-shrink-0 ml-2">{item.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.use}</p>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 한 끼 3천원 이하 메뉴 예시</h2>
            <div className="space-y-2">
              {[
                { name: "계란국 + 김치 + 밥", cost: "약 700원", cal: "약 350kcal" },
                { name: "두부된장국 + 콩나물무침 + 밥", cost: "약 1,200원", cal: "약 400kcal" },
                { name: "참치마요덮밥", cost: "약 1,800원", cal: "약 450kcal" },
                { name: "계란프라이 + 김치 + 밥", cost: "약 500원", cal: "약 380kcal" },
                { name: "콩나물국 + 계란말이 + 밥", cost: "약 1,500원", cal: "약 430kcal" },
                { name: "된장찌개 + 시금치나물 + 밥", cost: "약 2,000원", cal: "약 480kcal" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-bold text-green-600 w-20 flex-shrink-0">{item.cost}</span>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.cal}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 알뜰 장보기 노하우</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>일주일 식단 먼저 계획:</strong> 식단을 계획하고 필요한 재료만 사면 충동 구매를 줄일 수 있습니다.</li>
              <li><strong>대형마트 주말 할인 활용:</strong> 육류, 채소 등 생선류의 주말 행사를 이용하세요.</li>
              <li><strong>냉동 채소 활용:</strong> 냉동 시금치, 브로콜리 등은 신선 채소보다 저렴하고 오래 보관됩니다.</li>
              <li><strong>제철 채소 선택:</strong> 제철 채소는 가격이 저렴하고 영양도 풍부합니다.</li>
              <li><strong>재료 겹치게 구성:</strong> 같은 재료를 여러 요리에 활용하면 낭비가 없습니다. (예: 두부 → 찌개+조림+볶음)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 주간 장보기 예산 예시 (1인 기준)</h2>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                {[
                  { item: "계란 1판", price: "5,500원" },
                  { item: "두부 2모", price: "2,500원" },
                  { item: "콩나물 2봉", price: "2,000원" },
                  { item: "참치캔 3개", price: "5,000원" },
                  { item: "김치 500g", price: "3,500원" },
                  { item: "시금치 (냉동)", price: "2,500원" },
                  { item: "쌀 1kg", price: "3,000원" },
                ].map((row) => (
                  <div key={row.item} className="flex justify-between border-b border-orange-100 pb-2 last:border-0 last:pb-0">
                    <span>{row.item}</span>
                    <span className="font-medium">{row.price}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-orange-700 pt-2 border-t border-orange-200">
                  <span>합계</span>
                  <span>약 24,000원 (1주일)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                ※ 위 재료로 점심·저녁 7일치 식사가 가능합니다. 한 끼당 약 1,700원.
              </p>
            </div>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-gray-900 mb-2">저예산 식단 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              예산 설정에서 &ldquo;저렴하게&rdquo;를 선택하면 가성비 좋은 재료 위주로 식단을 구성해 드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              알뜰 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 식재료 가격은 지역, 시기에 따라 다를 수 있습니다. 참고용으로 활용해 주세요.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
