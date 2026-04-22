import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "밀프렙 완전 가이드 — 주말 2시간으로 일주일 식사 해결하기",
  description:
    "바쁜 직장인을 위한 밀프렙(Meal Prep) 완전 가이드. 주말에 한 번 준비해두면 평일 내내 건강한 집밥을 먹을 수 있는 방법을 알려드립니다.",
  openGraph: {
    title: "밀프렙 완전 가이드",
    description: "주말 2시간으로 일주일 식사 해결하는 방법",
  },
};

export default function MealPrepTips() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">밀프렙 가이드</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          밀프렙(Meal Prep) 완전 가이드
          <br />
          <span className="text-base font-normal text-gray-500">주말 2시간으로 일주일 식사 해결하기</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">밀프렙이란?</h2>
            <p>
              밀프렙(Meal Preparation)은 한 번에 여러 날치 식사를 미리 준비해두는 방법입니다.
              주로 주말에 2~3시간 투자해 평일 내내 먹을 반찬, 국, 구운 고기 등을 미리 만들어두는 것인데,
              직장인이나 바쁜 1인 가구에게 특히 효과적입니다.
              매일 조리 시간을 아끼는 것은 물론, 배달 음식 의존도를 크게 줄일 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. 밀프렙의 장점</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>시간 절약:</strong> 평일 저녁 조리 시간을 10분 이내로 줄일 수 있습니다.</li>
              <li><strong>식비 절약:</strong> 계획적인 장보기로 음식물 낭비와 충동 배달을 줄입니다.</li>
              <li><strong>건강 관리:</strong> 미리 준비된 건강한 음식이 있으면 편의점 음식 선택을 자연스럽게 줄이게 됩니다.</li>
              <li><strong>정신적 여유:</strong> "오늘 뭐 먹지?" 고민에서 해방됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 밀프렙 준비물</h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <ul className="space-y-2 text-sm">
                {[
                  { item: "밀폐 용기 (400ml, 800ml 각 3~5개)", tip: "투명한 유리나 PP 용기 추천" },
                  { item: "지퍼백 (대형)", tip: "냉동 식재료 보관에 유용" },
                  { item: "메모지 또는 라벨 스티커", tip: "요리 이름과 날짜 표기용" },
                  { item: "큰 냄비, 프라이팬", tip: "한 번에 많이 만들 수 있도록" },
                ].map((row) => (
                  <li key={row.item} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">✓</span>
                    <div>
                      <span className="font-medium">{row.item}</span>
                      <span className="text-gray-500 ml-2 text-xs">— {row.tip}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 주간 밀프렙 실전 루틴</h2>
            <p className="mb-3">일요일 오후 2시간 예시 루틴입니다.</p>
            <div className="space-y-3">
              {[
                {
                  time: "0~30분",
                  title: "국·찌개 끓이기",
                  desc: "된장찌개나 미역국을 큰 냄비로 한 번에 만들어 4~5일치 보관. 냉장 4일, 냉동 2주.",
                },
                {
                  time: "30~60분",
                  title: "단백질 반찬 조리",
                  desc: "닭가슴살 볶음, 두부조림, 계란말이 중 1~2가지를 미리 만들어둡니다.",
                },
                {
                  time: "60~90분",
                  title: "나물·무침 준비",
                  desc: "시금치나물, 콩나물무침, 오이무침 등 채소 반찬 2~3가지를 준비합니다.",
                },
                {
                  time: "90~120분",
                  title: "분류·포장·보관",
                  desc: "용기에 담아 날짜 라벨 붙이고 냉장·냉동 구분해 정리합니다.",
                },
              ].map((step) => (
                <div key={step.time} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
                  <div className="text-xs font-bold text-orange-500 w-16 flex-shrink-0 pt-0.5">{step.time}</div>
                  <div>
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 반찬 보관 기간 가이드</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-100">반찬 종류</th>
                    <th className="text-center p-2 border border-gray-100">냉장</th>
                    <th className="text-center p-2 border border-gray-100">냉동</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "된장찌개·미역국", fridge: "3~4일", freeze: "2주" },
                    { type: "볶음류 (제육볶음 등)", fridge: "3~4일", freeze: "1개월" },
                    { type: "조림류 (두부조림 등)", fridge: "5~7일", freeze: "1개월" },
                    { type: "나물·무침류", fridge: "3~4일", freeze: "비추천" },
                    { type: "계란말이·계란찜", fridge: "2~3일", freeze: "비추천" },
                    { type: "구이류 (닭가슴살 등)", fridge: "3~4일", freeze: "2주" },
                  ].map((row) => (
                    <tr key={row.type}>
                      <td className="p-2 border border-gray-100">{row.type}</td>
                      <td className="text-center p-2 border border-gray-100 text-orange-600">{row.fridge}</td>
                      <td className="text-center p-2 border border-gray-100 text-blue-600">{row.freeze}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 밀프렙 초보자를 위한 팁</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>처음에는 반찬 2~3가지만 도전하세요. 욕심 내서 10가지 만들다 지쳐 포기하는 것보다 낫습니다.</li>
              <li>국물 요리는 넉넉히 만들어 냉동 보관하면 언제든 꺼내 먹을 수 있습니다.</li>
              <li>밥은 한 번에 많이 지어 1인분씩 소분해 냉동해두면 전자레인지로 3분이면 됩니다.</li>
              <li>장보기와 밀프렙을 같은 날 하면 효율적입니다. 장보고 바로 조리하세요.</li>
            </ul>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-6">
            <h2 className="font-bold text-gray-900 mb-2">밀프렙 식단 계획 자동으로 만들기</h2>
            <p className="text-sm text-gray-600 mb-4">
              식단 생성기로 주간 식단을 미리 계획해두면 어떤 재료를 장봐야 할지 쉽게 파악할 수 있습니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              이번 주 식단 계획 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 식재료 보관 기간은 보관 방법과 신선도에 따라 달라질 수 있습니다. 냄새나 색이 이상하면 섭취하지 마세요.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
