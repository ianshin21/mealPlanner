import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "면책 고지 | 자동 식단 생성기",
  description:
    "자동 식단 생성기는 일반 건강 참고용 서비스입니다. 의료·영양 전문가의 조언을 대체하지 않으며, 질환이 있는 경우 전문가 상담을 권장합니다.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">면책 고지</h1>
        <p className="text-xs text-gray-400 mb-6">최종 업데이트: 2026년 5월</p>

        {/* 상단 요약 경고 박스 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 space-y-2">
          <p className="text-sm font-semibold text-amber-800">
            이 서비스는 의료 서비스가 아닙니다.
          </p>
          <p className="text-sm text-amber-700 leading-relaxed">
            제공되는 식단 정보는 <strong>일반 성인을 위한 참고용 예시</strong>입니다.
            개인의 건강 상태, 질환, 특수한 영양 요구를 반영한 처방이 아니므로,
            건강에 중요한 결정을 내리기 전에 반드시 전문가와 상담하세요.
          </p>
        </div>

        <div className="space-y-8 text-gray-700">

          {/* 1. 일반 참고용 서비스 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. 일반 건강 참고용 서비스</h2>
            <p className="text-sm leading-relaxed">
              자동 식단 생성기가 제공하는 식단 구성, 메뉴 제안, 영양 관련 설명은
              <strong> 일반적인 식생활 참고 목적</strong>으로만 제공됩니다.
              이 서비스는 개인의 체질, 병력, 현재 건강 상태를 진단하거나 처방하지 않습니다.
            </p>
          </section>

          {/* 2. 의료 조언 아님 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. 의료·영양 조언을 대체하지 않습니다</h2>
            <p className="text-sm leading-relaxed">
              본 서비스의 어떤 내용도 의사, 영양사, 또는 기타 의료·건강 전문가의 진단이나
              개인 맞춤 조언을 대체하지 않습니다. 서비스를 이용한 후라도 건강 관련 결정은
              반드시 전문가의 판단에 따르시기 바랍니다.
            </p>
          </section>

          {/* 3. 전문가 상담 권장 대상 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. 전문가 상담을 먼저 받아야 하는 경우</h2>
            <p className="text-sm">아래에 해당한다면 이 서비스를 이용하기 전에 전문가와 상담하세요.</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>당뇨, 고혈압, 신장 질환, 심혈관 질환 등 만성 질환이 있는 경우</li>
              <li>의사나 영양사로부터 특정 식이 요법(저염식, 저단백식 등)을 처방받은 경우</li>
              <li>체중 감량 목적으로 극단적 칼로리 제한을 고려하는 경우</li>
              <li>식품 알레르기 반응이 심하거나 아나필락시스 이력이 있는 경우</li>
              <li>특정 약물을 복용 중이어서 식이 제한이 필요한 경우</li>
            </ul>
          </section>

          {/* 4. 임신·수유·미성년자·특수 상황 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. 임신·수유·미성년자·특수 상황 주의</h2>
            <p className="text-sm leading-relaxed">
              아래에 해당하는 경우 본 서비스의 식단을 그대로 따르지 마시고, 전문가 지도 아래
              개인 상황에 맞는 식단을 별도로 계획하세요.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>임신 중:</strong> 임신 시기별로 필요한 영양소 기준이 달라지며, 피해야 할
                식품이 있습니다. 산부인과 또는 영양사 상담을 권장합니다.
              </li>
              <li>
                <strong>수유 중:</strong> 수유 기간에는 일부 식재료가 모유를 통해 영향을 줄 수
                있습니다. 의료진의 안내를 따르세요.
              </li>
              <li>
                <strong>성장기 미성년자:</strong> 이 서비스는 성인 기준으로 식단을 구성합니다.
                아동·청소년의 영양 기준은 성인과 다르므로 별도 전문가 상담이 필요합니다.
              </li>
              <li>
                <strong>회복 중이거나 수술 전후인 경우:</strong> 의료 처치 전후 식이 제한이 있을
                수 있으므로 담당 의료진의 지침을 우선합니다.
              </li>
            </ul>
          </section>

          {/* 5. AI 생성 결과의 한계 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">5. 결과는 AI가 생성한 참고용 예시입니다</h2>
            <p className="text-sm leading-relaxed">
              식단 결과는 AI 언어 모델이 생성하며, 다음과 같은 한계가 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                칼로리·영양소 수치는 참고용 추정치입니다. 실제 수치는 조리 방법, 재료 양,
                식재료 품질에 따라 달라집니다.
              </li>
              <li>
                알레르기 필터를 제공하지만, 복합 재료나 가공식품의 숨은 성분까지 완벽히
                걸러내지 못할 수 있습니다. 알레르기가 있는 경우 각 메뉴 재료를 직접 확인하세요.
              </li>
              <li>
                동일한 조건으로 생성하더라도 결과가 매번 다를 수 있으며, 특정 결과가
                항상 영양학적으로 최적이라고 보장하지 않습니다.
              </li>
            </ul>
          </section>

          {/* 6. 다이어트·체중 감량 관련 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">6. 다이어트·체중 감량 목적 이용 시</h2>
            <p className="text-sm leading-relaxed">
              이 서비스는 특정 체중 감량 결과를 보장하지 않습니다. 체중 변화에는 식사 외에
              신체 활동, 수면, 스트레스, 개인 대사 등 다양한 요인이 영향을 미칩니다.
              극단적인 칼로리 제한이나 단기 속성 다이어트는 건강에 해로울 수 있으며,
              전문가 감독 없이 시도하지 않도록 권장합니다.
            </p>
          </section>

          {/* 7. 책임 제한 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">7. 책임 제한</h2>
            <p className="text-sm leading-relaxed">
              본 서비스 이용으로 발생하는 건강 문제, 알레르기 반응, 또는 기타 손해에 대해
              서비스 운영자는 책임을 지지 않습니다. 서비스에서 제공하는 정보를 따르는 것은
              이용자 본인의 판단과 책임 하에 이루어집니다.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
