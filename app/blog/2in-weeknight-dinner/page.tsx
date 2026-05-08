import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "2인 가족 평일 저녁 식단 팁 — 30분 안에 두 사람 밥상 차리기",
  description:
    "2인 가족을 위한 평일 저녁 식단 구성 방법. 재료 낭비 없이 30분 내 두 사람 분량의 저녁을 준비하는 실용적인 팁을 소개합니다.",
  openGraph: {
    title: "2인 가족 평일 저녁 식단 팁",
    description: "30분 안에 두 사람 밥상 차리는 현실적인 방법",
  },
};

export default function Blog2inWeeknightDinner() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">2인 가족 평일 저녁 식단</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          2인 가족 평일 저녁 식단 팁
          <br />
          <span className="text-base font-normal text-gray-500">30분 안에 두 사람 밥상 차리기</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2인 식단의 현실적인 어려움</h2>
            <p>
              2인 가족 식단의 가장 큰 고민은 &quot;적당한 양&quot;입니다. 1인분은 너무 적고,
              4인분을 만들면 남아서 버리게 됩니다. 거기에 평일 퇴근 후 지친 몸으로
              30분 안에 밥상을 차려야 한다는 현실적인 제약까지 더해지면,
              결국 배달이나 편의식으로 손이 가기 쉽습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 2인 기준 메뉴 선정 기준</h2>
            <div className="space-y-3">
              {[
                {
                  icon: "⏱️",
                  title: "조리 시간 30분 이내",
                  desc: "주재료 1~2가지로 완성되는 요리 위주로 선택합니다. 반조리 식품을 활용하면 시간을 더 단축할 수 있습니다.",
                },
                {
                  icon: "♻️",
                  title: "재료 겹치기",
                  desc: "월요일 제육볶음에 쓴 돼지고기를 목요일 돼지고기찌개에 활용하는 식으로, 같은 주재료로 다른 요리를 만들면 식재료 낭비가 줄어듭니다.",
                },
                {
                  icon: "🍳",
                  title: "국물 요리 주 2~3회",
                  desc: "국이나 찌개는 만들기 간단하고 밥 한 공기와 함께 든든한 식사가 됩니다. 한 냄비를 저녁에 넉넉히 만들어 다음 날 점심으로도 활용하세요.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold mb-1">{item.icon} {item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 평일 저녁 식단 예시 (5일)</h2>
            <div className="space-y-2">
              {[
                { day: "월", menu: "된장찌개 + 계란말이 + 밥", time: "20분" },
                { day: "화", menu: "제육볶음 + 시금치나물 + 밥", time: "25분" },
                { day: "수", menu: "순두부찌개 + 밥", time: "15분" },
                { day: "목", menu: "닭볶음탕 + 밥", time: "30분" },
                { day: "금", menu: "참치김치볶음밥", time: "15분" },
              ].map((item) => (
                <div key={item.day} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {item.day}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.menu}</div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 2인 장보기 전략</h2>
            <p className="mb-3">
              2인 가족은 &quot;소용량 + 자주&quot; 보다 &quot;중용량 + 계획적으로&quot;가 더 효율적입니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>고기류:</strong> 500g 단위 구매 후 200g씩 소분 냉동. 두 끼 분량으로 나눠 사용.
              </li>
              <li>
                <strong>채소류:</strong> 반찬용 채소는 쿡 씻어 소분해두면 매번 손질할 필요 없음.
              </li>
              <li>
                <strong>두부·계란:</strong> 한 번에 넉넉히 구매해 다양한 요리에 활용.
              </li>
              <li>
                <strong>냉동 채소 활용:</strong> 브로콜리, 콩, 옥수수 등 냉동 채소를 구비하면
                찌개나 볶음에 바로 넣을 수 있어 편리.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 평일 저녁 준비 시간 단축 비결</h2>
            <div className="space-y-2">
              {[
                { tip: "양념 미리 섞어두기", desc: "제육볶음 양념, 불고기 소스 등을 주말에 만들어 냉장 보관" },
                { tip: "쌀 미리 불려두기", desc: "퇴근 전 물에 불려두면 밥 짓는 시간 단축" },
                { tip: "찌개 육수 냉동 보관", desc: "다시마·멸치 육수를 한꺼번에 끓여 냉동해두면 찌개 요리가 빨라짐" },
                { tip: "반찬 2~3가지 주말 일괄 준비", desc: "무침·조림 반찬은 4~5일 보관 가능, 평일에는 데워 먹기만 하면 됨" },
              ].map((item) => (
                <div key={item.tip} className="flex gap-3 bg-orange-50 rounded-xl p-3">
                  <span className="text-orange-500 font-bold text-sm flex-shrink-0">✓</span>
                  <div>
                    <div className="font-semibold text-sm">{item.tip}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 지속 가능한 식단을 위한 마인드셋</h2>
            <p>
              완벽한 식단보다 실천 가능한 식단이 더 중요합니다. 일주일에 한두 번 외식하거나
              배달을 시키는 날을 미리 식단에 포함시키면 죄책감 없이 꾸준히 유지할 수 있습니다.
              중요한 건 &quot;대부분의 날&quot;을 집밥으로 채우는 것입니다.
            </p>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">2인 맞춤 식단을 자동으로 만들어 드립니다</h2>
            <p className="text-sm text-gray-600 mb-4">
              위 원칙을 매주 직접 적용하기 번거롭다면, 자동 식단 생성기를 사용해보세요.
              2인·평일 저녁 조건에 맞게 14일 또는 28일 식단을 자동으로 구성해 드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              2인 식단 자동 생성하기 →
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
