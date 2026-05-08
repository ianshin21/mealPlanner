import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "다이어트 식단이 식상하지 않게 짜는 법 — 단조로움 없이 유지하는 방법",
  description:
    "닭가슴살·샐러드만 반복되는 다이어트 식단에서 벗어나는 방법. 칼로리를 크게 늘리지 않으면서 다양한 메뉴를 유지하는 실용적인 구성법을 소개합니다.",
  openGraph: {
    title: "다이어트 식단이 식상하지 않게 짜는 법",
    description: "단조롭지 않게 다이어트 식단을 유지하는 방법",
  },
};

export default function BlogDietMealVariety() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">다이어트 식단 다양하게 짜기</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          다이어트 식단이 식상하지 않게 짜는 법
          <br />
          <span className="text-base font-normal text-gray-500">닭가슴살·샐러드의 굴레에서 벗어나기</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">다이어트 식단이 작심삼일로 끝나는 이유</h2>
            <p>
              다이어트 식단을 시작하면 처음 1~2주는 의지로 버티지만, 대부분 세 번째 주부터
              무너집니다. 이유는 대부분 &quot;지겨움&quot;입니다. 닭가슴살·샐러드·고구마만
              반복되는 식단은 아무리 결심이 강해도 지속하기 어렵습니다.
              다이어트 식단을 오래 유지하려면 다양성이 반드시 필요합니다.
            </p>
            <p className="mt-2 text-xs text-gray-500 bg-yellow-50 rounded-xl p-3 border border-yellow-100">
              ※ 이 글은 일반적인 건강 식단 구성에 관한 참고 정보입니다. 특정 질환이 있거나
              의학적 식이 관리가 필요한 경우 반드시 전문가와 상담하세요.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 같은 재료, 다른 조리법으로 변화 주기</h2>
            <p className="mb-3">
              닭가슴살도 조리법에 따라 완전히 다른 음식이 됩니다. 재료 자체를 바꾸지 않아도
              조리법을 바꾸면 다양성을 확보할 수 있습니다.
            </p>
            <div className="space-y-2">
              {[
                { ingredient: "닭가슴살", methods: ["닭가슴살 스테이크", "닭가슴살 샐러드", "닭가슴살 덮밥", "닭가슴살 국"] },
                { ingredient: "두부", methods: ["두부구이", "순두부찌개", "두부조림", "두부샐러드"] },
                { ingredient: "계란", methods: ["계란찜", "계란말이", "스크램블에그", "삶은 계란 + 채소"] },
              ].map((item) => (
                <div key={item.ingredient} className="border border-gray-100 rounded-xl p-3">
                  <div className="font-semibold text-sm text-orange-600 mb-2">
                    {item.ingredient}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.methods.map((m) => (
                      <span key={m} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 한식 중심으로 구성하면 덜 질린다</h2>
            <p>
              서양식 샐러드 위주의 다이어트 식단은 한국 사람에게 빨리 질립니다.
              한식은 국물 요리가 많아 포만감이 높고, 채소를 다양하게 활용할 수 있어
              다이어트 식단에도 충분히 적합합니다.
            </p>
            <div className="mt-3 space-y-2">
              {[
                { menu: "콩나물국", cal: "약 60kcal", note: "국물로 포만감 충족" },
                { menu: "시금치나물 + 현미밥", cal: "약 300kcal", note: "식이섬유·철분 풍부" },
                { menu: "순두부찌개 (고기 소량)", cal: "약 200kcal", note: "단백질 보충" },
                { menu: "제육볶음 (돼지 앞다리)", cal: "약 350kcal", note: "양을 조절하면 다이어트에도 OK" },
              ].map((item) => (
                <div key={item.menu} className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.menu}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.note}</div>
                  </div>
                  <span className="text-xs text-green-700 font-medium flex-shrink-0">{item.cal}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">* 칼로리는 대략적인 참고치이며 조리 방법에 따라 달라집니다.</p>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. '완화일'을 미리 계획에 넣기</h2>
            <p>
              일주일 7일 중 하루 정도는 처음부터 &quot;좀 더 자유로운 날&quot;로 계획하면
              나머지 6일을 더 수월하게 유지할 수 있습니다. 이 날 먹고 싶은 것을 먹되,
              폭식보다는 &quot;오늘은 칼로리 조금 더 허용하는 날&quot; 정도로 설정하는 것이
              장기 유지에 도움이 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 양념·소스로 다양성 확보</h2>
            <p className="mb-3">
              같은 닭가슴살도 소스에 따라 완전히 다른 음식이 됩니다.
              소스 종류를 바꾸는 것만으로도 식단 다양성을 높일 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-2">
              {["간장+참기름", "레몬+올리브오일", "된장+마늘", "고추장+식초", "허브+소금", "들기름+깨"].map((sauce) => (
                <span key={sauce} className="text-xs bg-orange-50 border border-orange-200 text-orange-700 rounded-full px-3 py-1">
                  {sauce}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 식단 다양성을 유지하는 현실적인 접근</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>주 단위로 메뉴를 순환:</strong> 이번 주의 메뉴 목록을 다음 주에 그대로 반복하되
                조리법만 바꾸기.
              </li>
              <li>
                <strong>식재료 색깔로 구성 확인:</strong> 빨간색(토마토), 초록색(시금치), 노란색(계란) 등
                색깔이 다양하면 영양 균형도 자연스럽게 맞춰집니다.
              </li>
              <li>
                <strong>조리법 교대:</strong> 볶음 → 국 → 구이 → 무침 순서로 교대하면
                맛의 단조로움을 피할 수 있습니다.
              </li>
            </ul>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">가볍게 감량하는 다양한 식단을 자동으로 만들어 드립니다</h2>
            <p className="text-sm text-gray-600 mb-4">
              &quot;가볍게 감량&quot; 목표를 선택하면 같은 메뉴가 반복되지 않도록 14일·28일 식단을
              자동으로 구성합니다. 마음에 안 드는 끼니는 바로 교체할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              다이어트 식단 자동 생성하기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 건강 참고 정보이며 의료·영양 전문가의 조언을 대체하지 않습니다.
            다이어트는 개인 건강 상태에 따라 다를 수 있으므로 전문가 상담을 권장합니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
