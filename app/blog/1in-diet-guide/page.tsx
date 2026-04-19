import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "1인 가정 식단 완전 가이드 — 혼자 사는 분을 위한 실용 식단 관리",
  description:
    "혼자 살면서 매번 식단을 계획하기 어려운 분들을 위한 완전 가이드. 장보기부터 식단 구성, 반찬 보관까지 실용적인 팁을 알려드립니다.",
  openGraph: {
    title: "1인 가정 식단 완전 가이드",
    description: "혼자 사는 분을 위한 실용적인 식단 관리 방법",
  },
};

export default function Blog1inDietGuide() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">1인 가정 식단 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          1인 가정 식단 완전 가이드
          <br />
          <span className="text-base font-normal text-gray-500">혼자 살면서 건강하게 먹는 방법</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">혼밥의 가장 큰 어려움</h2>
            <p>
              1인 가정에서 식단을 관리하는 가장 큰 문제는 &quot;뭘 먹을지 매번 고민해야 한다&quot;는 점입니다.
              요리를 해도 혼자 먹기엔 양이 많고, 배달을 시키면 비용이 부담됩니다.
              냉장고에는 애매하게 남은 재료들이 가득하고, 결국 편의점에서 해결하는 날이 늘어납니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 식단 계획의 중요성</h2>
            <p>
              매일 즉흥적으로 식사를 결정하면 영양 불균형이 생기기 쉽습니다. 반면
              1주일치 식단을 미리 계획해두면 장보기가 효율적이고, 식비 절약 효과도 큽니다.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>식비 절약:</strong> 계획 없이 장보면 쓰지 않는 재료가 남아 버려집니다.</li>
              <li><strong>영양 균형:</strong> 미리 계획하면 고른 영양 섭취가 가능합니다.</li>
              <li><strong>시간 절약:</strong> &quot;오늘 뭐 먹지?&quot; 고민 시간이 사라집니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 1인 식단 구성 원칙</h2>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">🍚 밥류 (탄수화물)</h3>
                <p>하루 1~2끼 중 한 끼는 잡곡밥이나 현미밥으로 교체하면 식이섬유 섭취에 도움이 됩니다.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">🥩 단백질 반찬</h3>
                <p>계란, 두부, 닭가슴살, 생선 등 단백질 반찬을 매 끼니 포함하면 포만감이 오래 지속됩니다.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">🥬 채소 반찬</h3>
                <p>나물, 무침 등 채소 반찬을 1~2가지 곁들이면 비타민과 식이섬유를 보충할 수 있습니다.</p>
              </div>
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 1인 장보기 요령</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>계란 한 판(30개)은 2~3주 분량으로 다양하게 활용</li>
              <li>두부 1모는 반으로 나눠 각기 다른 요리로 활용</li>
              <li>닭가슴살은 냉동 보관으로 필요할 때마다 꺼내 사용</li>
              <li>김치는 대용량 구매 후 냉동 보관하면 오래 신선하게 유지</li>
              <li>냉동 채소(브로콜리, 시금치 등)는 손질 없이 바로 사용 가능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 시간 절약 조리법</h2>
            <p className="mb-3">
              직장인이라면 평일 조리 시간이 30분 이내여야 지속 가능합니다.
            </p>
            <div className="space-y-2">
              {[
                { time: "5분", dish: "계란프라이 + 김치", tip: "가장 빠른 한 끼" },
                { time: "10분", dish: "참치마요덮밥", tip: "캔 참치 활용" },
                { time: "15분", dish: "된장찌개 (레토르트)", tip: "된장찌개 소스 활용" },
                { time: "20분", dish: "제육볶음 + 밥", tip: "고기는 미리 양념해두면 더 빠름" },
              ].map((item) => (
                <div key={item.dish} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-bold text-orange-500 w-12 flex-shrink-0">{item.time}</span>
                  <div>
                    <div className="font-medium text-sm">{item.dish}</div>
                    <div className="text-xs text-gray-500">{item.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 반찬 보관 팁</h2>
            <p>
              반찬은 한 번에 4~5일치 만들어두면 매일 조리 부담이 줄어듭니다.
              밀폐 용기에 담아 냉장 보관하며, 볶음·무침 반찬은 3~4일,
              조림류는 5~7일 보관이 가능합니다.
            </p>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">식단 자동 생성기 활용하기</h2>
            <p className="text-sm text-gray-600 mb-4">
              매주 식단 계획 세우기가 귀찮다면, 자동 식단 생성기를 활용해보세요.
              14일 또는 28일치 식단을 한 번에 생성하고 원하는 끼니만 교체할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              무료로 식단 만들기 →
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
