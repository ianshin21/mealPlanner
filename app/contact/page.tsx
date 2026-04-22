import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "문의하기 | 자동 식단 생성기",
  description:
    "자동 식단 생성기 서비스에 대한 문의, 메뉴 제안, 오류 신고 등을 보내주세요.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">문의하기</h1>
        <p className="text-sm text-gray-500 mb-8">
          오류 신고, 메뉴 제안, 서비스 개선 의견을 환영합니다.
        </p>

        {/* 이메일 문의 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✉️</span>
            <h2 className="text-base font-bold text-gray-900">이메일 문의</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            아래 이메일로 문의해 주시면 영업일 기준 2~3일 이내 회신 드립니다.
          </p>
          <a
            href="mailto:ianshin580@gmail.com"
            className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 font-medium px-5 py-3 rounded-xl text-sm hover:bg-orange-100 transition-colors"
          >
            <span>📧</span>
            ianshin580@gmail.com
          </a>
        </section>

        {/* 문의 유형 안내 */}
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">문의 유형</h2>
          <div className="space-y-3">
            {[
              {
                icon: "🐛",
                title: "오류 신고",
                desc: "식단 생성이 안 되거나, 버튼이 작동하지 않는 등 기술적인 문제를 알려주세요.",
              },
              {
                icon: "🍽️",
                title: "메뉴 제안",
                desc: "추가했으면 하는 메뉴나 반찬이 있다면 제안해 주세요. 적극적으로 검토하겠습니다.",
              },
              {
                icon: "💡",
                title: "기능 개선 의견",
                desc: "서비스를 더 편리하게 사용할 수 있는 아이디어가 있으면 알려주세요.",
              },
              {
                icon: "📋",
                title: "저작권 / 정책 문의",
                desc: "콘텐츠 저작권, 개인정보, 광고 관련 문의는 이메일로 연락해 주세요.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 bg-gray-50 rounded-xl p-4"
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              {
                q: "생성된 식단은 저장되나요?",
                a: "식단은 브라우저의 세션 저장소에만 보관되며, 서버에는 저장되지 않습니다. 탭을 닫거나 24시간이 지나면 자동으로 삭제됩니다. 필요하시면 스크린샷이나 인쇄 기능을 이용해 저장해 주세요.",
              },
              {
                q: "알레르기 정보가 100% 정확한가요?",
                a: "메뉴별 알레르기 정보는 최대한 정확하게 입력했지만, 실제 식재료나 제품에 따라 다를 수 있습니다. 심각한 알레르기가 있으신 경우 반드시 식재료를 직접 확인하세요.",
              },
              {
                q: "칼로리 정보는 어떻게 계산되나요?",
                a: "1인분 기준 평균적인 칼로리 수치를 참고용으로 제공합니다. 실제 조리 방법, 재료 양에 따라 달라질 수 있으므로 참고용으로만 사용해 주세요.",
              },
              {
                q: "광고가 표시되는 이유는?",
                a: "자동 식단 생성기는 완전 무료 서비스입니다. 서비스 유지 비용을 충당하기 위해 Google AdSense 광고가 일부 페이지에 표시됩니다.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <summary className="px-4 py-3 text-sm font-medium text-gray-800 cursor-pointer select-none">
                  {item.q}
                </summary>
                <p className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-yellow-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
          본 서비스는 일반 건강 참고용 식단 정보를 제공하며, 의료·영양 전문가의 조언을 대체하지
          않습니다. 건강 관련 결정은 반드시 전문가와 상담 후 진행해 주세요.
        </div>
      </main>
      <Footer />
    </>
  );
}
