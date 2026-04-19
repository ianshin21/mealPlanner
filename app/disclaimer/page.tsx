import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "면책 고지",
  robots: { index: false },
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">면책 고지</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ 중요: 이 서비스는 의료 서비스가 아닙니다.
          </p>
        </div>

        <div className="text-sm text-gray-700 space-y-6">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. 의료 조언 아님</h2>
            <p>
              자동 식단 생성기가 제공하는 모든 식단 정보는 <strong>일반 성인의 건강 참고 목적</strong>으로만
              제공됩니다. 본 서비스의 정보는 의사, 영양사, 또는 기타 의료·건강 전문가의
              조언을 대체하지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. 전문가 상담 권고</h2>
            <p>다음에 해당하는 경우 반드시 전문가와 상담 후 식단을 결정하세요.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>당뇨, 고혈압, 신장 질환 등 만성 질환이 있는 경우</li>
              <li>특별한 영양 요구가 있는 경우 (임신, 수유, 성장기 등)</li>
              <li>특정 식이 요법이 필요한 경우</li>
              <li>식품 알레르기 반응이 심한 경우</li>
              <li>체중 감량 목적으로 극단적 칼로리 제한이 필요한 경우</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. 정확성 한계</h2>
            <p>
              본 서비스의 칼로리, 영양소 등 수치는 참고용 추정치이며, 실제 조리 방법,
              재료 양, 식재료 품질에 따라 달라질 수 있습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. 알레르기 주의</h2>
            <p>
              알레르기 필터 기능을 제공하나, 모든 식재료 성분을 완벽히 확인하기 어렵습니다.
              심각한 알레르기가 있는 경우 각 메뉴의 재료를 직접 확인하시기 바랍니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">5. 책임 제한</h2>
            <p>
              본 서비스 이용으로 발생하는 건강 문제, 알레르기 반응, 또는 기타 손해에 대해
              서비스 운영자는 법적 책임을 지지 않습니다. 서비스 이용은 사용자 본인의
              판단과 책임 하에 이루어집니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
