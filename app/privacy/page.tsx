import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 자동 식단 생성기",
  description:
    "자동 식단 생성기의 개인정보 수집 범위, 이용 목적, 보관 원칙, 광고 정책 등을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-xs text-gray-400 mb-6">최종 업데이트: 2026년 5월</p>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          본 방침은 자동 식단 생성기(이하 &quot;서비스&quot;)가 서비스 운영 과정에서 어떤 정보를
          수집하고 어떻게 이용하는지 안내합니다. 서비스는 회원가입 없이 누구나 익명으로 이용할 수
          있으며, 개인 식별 정보를 직접 수집하지 않습니다.
        </p>

        <div className="space-y-8 text-gray-700">

          {/* 1. 수집하는 정보 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">1. 수집하는 정보</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">1-1. 사용자 직접 입력 정보</h3>
              <p className="text-sm">
                식단 생성 시 입력하는 기간·인원·목표·식사 스타일·알레르기·비선호 식재료 등의
                조건은 서버에 영구 저장되지 않으며, 브라우저 세션(sessionStorage)에만 임시
                보관됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">1-2. 자동 수집 정보</h3>
              <p className="text-sm">서비스 이용 과정에서 아래 정보가 자동으로 수집될 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>접속 로그:</strong> 페이지 방문 시각, 접속 URL, 유입 경로(리퍼러)
                </li>
                <li>
                  <strong>브라우저·기기 정보:</strong> 브라우저 종류 및 버전, 운영체제, 화면
                  해상도 등 User-Agent에 포함된 기술적 정보
                </li>
                <li>
                  <strong>IP 주소:</strong> 서버 접속 시 인프라 수준에서 자동 기록됩니다. 이
                  정보는 개인을 직접 식별하는 데 사용되지 않습니다.
                </li>
                <li>
                  <strong>익명 사용 통계:</strong> 페이지 조회 수, 기능 사용 패턴 등 서비스
                  개선 목적의 집계 데이터 (Google Analytics)
                </li>
                <li>
                  <strong>쿠키(Cookie):</strong> 광고 및 분석 목적으로 Google이 설정합니다. 3항을
                  참고하세요.
                </li>
              </ul>
            </div>
          </section>

          {/* 2. 이용 목적 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">2. 정보 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>사용자가 요청한 식단 자동 생성 및 결과 제공</li>
              <li>서비스 안정성 모니터링 및 오류 파악</li>
              <li>익명 통계 분석을 통한 기능 개선</li>
              <li>Google AdSense를 통한 광고 노출 (관심 기반 광고 포함 가능)</li>
            </ul>
          </section>

          {/* 3. 쿠키 및 광고 정책 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">3. 쿠키 및 광고</h2>
            <p className="text-sm">
              서비스는 <strong>Google AdSense</strong>를 통해 광고를 제공합니다. Google은 쿠키를
              사용하여 이전 방문 기록을 바탕으로 관련성 높은 광고를 표시할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>광고 쿠키:</strong> Google AdSense가 맞춤 광고 제공 목적으로 설정하며,
                개인 식별 정보는 포함되지 않습니다.
              </li>
              <li>
                <strong>분석 쿠키:</strong> Google Analytics가 익명 방문 통계 수집 목적으로
                설정합니다.
              </li>
              <li>
                <strong>쿠키 비활성화:</strong> 브라우저 설정에서 쿠키를 차단하거나 삭제할 수
                있습니다. 단, 일부 기능이 제한될 수 있습니다.
              </li>
              <li>
                <strong>관심 기반 광고 해제:</strong>{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 underline"
                >
                  Google 광고 설정
                </a>
                에서 비활성화할 수 있습니다.
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              Google의 정보 처리 방식은{" "}
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

          {/* 4. 보관 기간 및 자동 삭제 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">4. 보관 기간 및 자동 삭제</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>입력 데이터·생성 식단:</strong> 브라우저 sessionStorage에만 저장되며,
                탭을 닫거나 24시간이 경과하면 자동 삭제됩니다. 서버에는 저장되지 않습니다.
              </li>
              <li>
                <strong>접속 로그(인프라 수준):</strong> Cloudflare Pages 인프라 제공자가
                운영 목적으로 단기 보관할 수 있습니다. 서비스 운영자가 직접 제어하는 범위 밖입니다.
              </li>
              <li>
                <strong>분석 데이터:</strong> Google Analytics 기본 보관 정책(최대 26개월)을
                따릅니다.
              </li>
            </ul>
          </section>

          {/* 5. 제3자 제공 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">5. 제3자 제공</h2>
            <p className="text-sm">
              개인 식별 정보를 제3자에게 제공하지 않습니다. 아래 외부 서비스는 익명화된 데이터에
              한해 기술적으로 관여합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Google Analytics:</strong> 익명 방문 통계 (IP 익명화 적용)
              </li>
              <li>
                <strong>Google AdSense:</strong> 광고 최적화 목적 쿠키
              </li>
              <li>
                <strong>Cloudflare Pages:</strong> 서비스 호스팅 인프라 제공자
              </li>
              <li>
                <strong>Anthropic Claude API:</strong> 식단 생성 요청 처리 (입력값 전달, 응답 반환 후 미저장)
              </li>
            </ul>
          </section>

          {/* 6. 사용자 권리 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">6. 사용자 권리</h2>
            <p className="text-sm">
              서비스는 계정이 없으므로 별도의 정보 열람·삭제 요청 절차가 없습니다. 브라우저의
              쿠키·캐시를 직접 삭제하면 로컬에 보관된 모든 임시 정보가 제거됩니다. 추가 문의는
              9항의 연락처를 이용하세요.
            </p>
          </section>

          {/* 7. 어린이 보호 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">7. 어린이 개인정보 보호</h2>
            <p className="text-sm">
              서비스는 만 14세 미만을 대상으로 하지 않습니다. 만 14세 미만 사용자의 개인정보는
              의도적으로 수집하지 않습니다.
            </p>
          </section>

          {/* 8. 방침 변경 안내 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">8. 방침 변경 안내</h2>
            <p className="text-sm">
              서비스 운영 방식 변경에 따라 본 방침이 수정될 수 있습니다. 변경 시 본 페이지 상단의
              &quot;최종 업데이트&quot; 날짜를 갱신하여 안내합니다.
            </p>
          </section>

          {/* 9. 문의 */}
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
