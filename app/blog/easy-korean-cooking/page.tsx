import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "요리 초보도 쉽게 만드는 한식 20선 — 20분 이내 완성 집밥",
  description:
    "요리 경험이 없어도 따라할 수 있는 쉬운 한식 20가지. 재료 3~4가지로 20분 이내 완성할 수 있는 집밥 레시피를 알려드립니다.",
  openGraph: {
    title: "요리 초보도 쉽게 만드는 한식 20선",
    description: "20분 이내 완성, 재료 3가지로 만드는 쉬운 집밥",
  },
};

const EASY_DISHES = [
  {
    name: "계란프라이",
    time: "5분",
    difficulty: "★☆☆",
    tip: "기름을 두르고 계란을 깨뜨린 후 뚜껑을 덮으면 반숙/완숙 모두 가능",
  },
  {
    name: "된장찌개",
    time: "15분",
    difficulty: "★☆☆",
    tip: "두부, 애호박, 된장만 있으면 완성. 멸치 육수 대신 물에 된장 녹여도 충분",
  },
  {
    name: "계란찜",
    time: "15분",
    difficulty: "★☆☆",
    tip: "계란에 물 1:1 비율, 전자레인지 3분으로도 완성 가능",
  },
  {
    name: "두부조림",
    time: "15분",
    difficulty: "★☆☆",
    tip: "두부 + 간장 + 고춧가루 + 참기름. 4가지 재료로 완성",
  },
  {
    name: "콩나물국",
    time: "15분",
    difficulty: "★☆☆",
    tip: "콩나물을 물에 넣고 끓이다가 소금, 국간장으로 간. 뚜껑 열고 끓여야 비린내 없음",
  },
  {
    name: "볶음밥",
    time: "10분",
    difficulty: "★☆☆",
    tip: "냉장고에 남은 재료 + 찬밥 + 계란. 간장으로 간 맞추면 완성",
  },
  {
    name: "참치마요덮밥",
    time: "5분",
    difficulty: "★☆☆",
    tip: "참치캔 물기 빼고 마요네즈 섞어 밥 위에 얹기. 간장 한 방울 추가 가능",
  },
  {
    name: "김치찌개",
    time: "20분",
    difficulty: "★★☆",
    tip: "익은 김치 + 돼지고기(없어도 됨) + 두부. 김치가 잘 익을수록 맛있음",
  },
  {
    name: "미역국",
    time: "20분",
    difficulty: "★☆☆",
    tip: "불린 미역 + 참기름에 볶기 + 물 + 소금. 소고기 없이도 맛있음",
  },
  {
    name: "제육볶음",
    time: "20분",
    difficulty: "★★☆",
    tip: "돼지고기 + 고추장 + 간장 + 마늘. 미리 양념에 재워두면 더 맛있음",
  },
];

export default function EasyKoreanCooking() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-orange-500">홈</Link>
          <span className="text-xs text-gray-300 mx-1">›</span>
          <span className="text-xs text-gray-400">쉬운 한식 요리</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-tight">
          요리 초보도 쉽게 만드는 한식 20선
          <br />
          <span className="text-base font-normal text-gray-500">20분 이내 완성 집밥</span>
        </h1>

        <AdBanner format="horizontal" className="my-6" />

        <article className="text-sm text-gray-700 space-y-6 leading-relaxed">
          <section>
            <p>
              요리를 배워본 적 없어도 괜찮습니다. 한식의 대부분은 기본 양념 몇 가지만 있으면
              누구나 만들 수 있습니다. 가장 기본이 되는 양념 세트를 갖춰두면 아래 요리 대부분을
              만들 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">기본 양념 준비물</h2>
            <div className="grid grid-cols-3 gap-2">
              {["간장", "된장", "고추장", "참기름", "소금", "설탕", "마늘(다진)", "식용유"].map((item) => (
                <div key={item} className="bg-orange-50 rounded-lg py-2 px-3 text-xs text-center font-medium text-orange-700">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              이 8가지만 있으면 한식 대부분을 만들 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-4">쉬운 한식 TOP 10</h2>
            <div className="space-y-3">
              {EASY_DISHES.map((dish, i) => (
                <div key={dish.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-gray-900">{dish.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{dish.time}</span>
                      <span>{dish.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 pl-8">{dish.tip}</p>
                </div>
              ))}
            </div>
          </section>

          <AdBanner format="rectangle" className="my-6" />

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">초보자를 위한 요리 팁</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">간 맞추기</h3>
                <p className="text-xs">처음엔 간을 약하게 시작해 조금씩 추가하세요. 짜지면 되돌리기 어렵습니다.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">불 조절</h3>
                <p className="text-xs">초보자는 중불로 시작하세요. 강불은 타기 쉽고 약불은 시간이 오래 걸립니다.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold mb-1">레시피 앱 활용</h3>
                <p className="text-xs">처음엔 정확한 레시피를 따라하고, 익숙해지면 입맛대로 조절하세요.</p>
              </div>
            </div>
          </section>

          <div className="bg-orange-50 rounded-2xl p-5 mt-8">
            <h2 className="font-bold text-gray-900 mb-2">오늘 뭐 먹을지 고민되신다면?</h2>
            <p className="text-sm text-gray-600 mb-4">
              이 메뉴들을 포함한 14일·28일치 식단을 자동으로 만들어드립니다.
            </p>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
            >
              무료로 식단 만들기 →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6 border-t pt-4">
            * 본 글은 일반 참고 정보이며 개인별 조리 환경에 따라 결과가 다를 수 있습니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
