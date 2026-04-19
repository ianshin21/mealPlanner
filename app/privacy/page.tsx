import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>

        <div className="prose prose-sm text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">최종 업데이트: 2024년 1월</p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. 수집하는 개인정보</h2>
            <p>
              자동 식단 생성기(이하 &quot;서비스&quot;)는 회원가입이 없으며,
              최소한의 정보만 사용합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>사용자가 입력한 정보:</strong> 기간, 인원, 목표, 식사 스타일, 알레르기,
                비선호 식재료 등 식단 생성에 필요한 정보. 이 정보는 서버에 영구 저장되지 않으며
                세션 종료 시 자동 소멸됩니다.
              </li>
              <li>
                <strong>자동 수집 정보:</strong> 서비스 개선을 위해 페이지 방문 기록,
                사용 패턴 등을 익명으로 수집할 수 있습니다 (Google Analytics 등).
              </li>
              <li>
                <strong>쿠키:</strong> 광고 게재(Google AdSense) 및 서비스 개선 목적으로
                쿠키를 사용할 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. 정보 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>식단 자동 생성 서비스 제공</li>
              <li>서비스 품질 개선 및 통계 분석</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. 정보 보관 및 파기</h2>
            <p className="text-sm">
              사용자가 입력한 식단 조건 및 생성된 식단은 세션 저장소(브라우저 sessionStorage)에만
              저장되며, 브라우저 탭을 닫거나 24시간이 경과하면 자동으로 삭제됩니다.
              서버에 개인 식단 데이터를 영구 저장하지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. 제3자 제공</h2>
            <p className="text-sm">
              개인 식별 정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우 익명화된 데이터를
              제3자 서비스와 공유할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Google Analytics: 익명 방문 통계</li>
              <li>Google AdSense: 광고 최적화 목적 쿠키</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">5. 사용자 권리</h2>
            <p className="text-sm">
              서비스는 개인 계정이 없으므로 별도의 정보 열람·삭제 요청이 불필요합니다.
              브라우저 캐시 및 쿠키를 직접 삭제하면 모든 임시 정보가 제거됩니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">6. 문의</h2>
            <p className="text-sm">
              개인정보 관련 문의는 서비스 내 문의 채널을 통해 연락해 주세요.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
