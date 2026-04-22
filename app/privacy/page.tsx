import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 자동 식단 생성기",
  description: "자동 식단 생성기의 개인정보 수집 및 이용, 쿠키 정책, Google AdSense 광고 관련 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>

        <div className="prose prose-sm text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">최종 업데이트: 2025년 4월</p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. 수집하는 정보</h2>
            <p>
              자동 식단 생성기(이하 &quot;서비스&quot;)는 회원가입이 없으며
              최소한의 정보만 사용합니다.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>사용자 입력 정보:</strong> 기간, 인원, 목표, 식사 스타일, 알레르기,
                비선호 식재료 등 식단 생성에 필요한 정보. 이 정보는 서버에 영구 저장되지 않으며
                브라우저 세션 종료 또는 24시간 경과 시 자동 소멸됩니다.
              </li>
              <li>
                <strong>자동 수집 정보:</strong> 서비스 개선 목적으로 페이지 방문 기록,
                사용 패턴 등을 익명으로 수집합니다 (Google Analytics).
              </li>
              <li>
                <strong>쿠키(Cookie):</strong> 아래 3항을 참고해 주세요.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. 정보 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>식단 자동 생성 서비스 제공</li>
              <li>서비스 품질 개선 및 익명 통계 분석</li>
              <li>맞춤형 광고 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. 쿠키 및 광고 정책</h2>
            <p className="text-sm">
              본 서비스는 <strong>Google AdSense</strong>를 통해 광고를 제공합니다.
              Google은 쿠키를 사용하여 방문자의 이전 사이트 방문 기록을 바탕으로 관련성 높은 광고를 표시합니다.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>광고 쿠키:</strong> Google AdSense가 맞춤 광고 제공 목적으로 설정합니다.
                이 쿠키에는 개인 식별 정보가 포함되지 않습니다.
              </li>
              <li>
                <strong>분석 쿠키:</strong> Google Analytics가 익명 방문 통계 수집 목적으로 설정합니다.
              </li>
              <li>
                <strong>쿠키 거부:</strong> 브라우저 설정에서 쿠키를 거부하거나 삭제할 수 있으나,
                일부 서비스 기능이 제한될 수 있습니다.
              </li>
              <li>
                <strong>맞춤 광고 비활성화:</strong>{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 underline"
                >
                  Google 광고 설정
                </a>
                에서 관심 기반 광고를 비활성화할 수 있습니다.
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              Google의 개인정보 처리 방식에 대한 자세한 내용은{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                Google 개인정보처리방침
              </a>
              을 참고하세요.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. 정보 보관 및 파기</h2>
            <p className="text-sm">
              사용자가 입력한 식단 조건 및 생성된 식단은 브라우저 sessionStorage에만 저장되며,
              브라우저 탭을 닫거나 24시간이 경과하면 자동으로 삭제됩니다.
              서버에 개인 식단 데이터를 영구 저장하지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">5. 제3자 제공</h2>
            <p className="text-sm">
              개인 식별 정보를 제3자에게 제공하지 않습니다. 다음의 익명화된 데이터는
              아래 서비스와 공유될 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Google Analytics: 익명 방문 통계 (IP 익명화 적용)</li>
              <li>Google AdSense: 광고 최적화 목적 쿠키</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">6. 사용자 권리</h2>
            <p className="text-sm">
              서비스는 개인 계정이 없으므로 별도의 정보 열람·삭제 요청이 불필요합니다.
              브라우저의 캐시 및 쿠키를 직접 삭제하면 모든 임시 정보가 제거됩니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">7. 어린이 개인정보 보호</h2>
            <p className="text-sm">
              본 서비스는 만 14세 미만 어린이를 대상으로 하지 않습니다.
              만 14세 미만 사용자의 개인정보는 의도적으로 수집하지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">8. 방침 변경 안내</h2>
            <p className="text-sm">
              개인정보처리방침이 변경될 경우 본 페이지 상단의 &quot;최종 업데이트&quot; 날짜를
              변경하여 안내합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">9. 문의</h2>
            <p className="text-sm">
              개인정보 관련 문의는{" "}
              <a href="mailto:ianshin580@gmail.com" className="text-orange-500 underline">
                ianshin580@gmail.com
              </a>
              으로 연락해 주세요.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
