import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "이용약관 | 자동 식단 생성기",
  description: "자동 식단 생성기 서비스 이용 조건, 금지 행위, 면책 범위, 서비스 변경 정책을 안내합니다.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">이용약관</h1>
        <p className="text-xs text-gray-400 mb-6">최종 업데이트: 2026년 5월</p>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          본 약관은 자동 식단 생성기(이하 &quot;서비스&quot;) 이용과 관련하여 운영자와
          이용자 간의 권리, 의무 및 책임 사항을 안내합니다. 서비스를 이용하면 본 약관에
          동의한 것으로 간주합니다.
        </p>

        <div className="space-y-8 text-gray-700">

          {/* 제1조 목적 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제1조 (목적)</h2>
            <p className="text-sm">
              본 약관은 자동 식단 생성기 서비스의 이용 조건과 운영자·이용자 간의 기본적인
              사항을 정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 서비스 내용 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제2조 (서비스 내용)</h2>
            <p className="text-sm">서비스는 다음 기능을 제공합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>인원(1인·2인) 및 기간(14일·28일) 선택에 따른 자동 식단 생성</li>
              <li>목표·식사 스타일·알레르기·비선호 식재료 반영</li>
              <li>끼니별 메뉴 교체 기능</li>
              <li>생성된 식단 결과 화면 제공</li>
            </ul>
            <p className="text-sm text-gray-500">
              서비스는 회원가입 없이 익명으로 이용할 수 있으며, AI 모델 응답을 기반으로
              식단을 구성합니다. 결과는 참고용이며 영양학적 정확성을 보장하지 않습니다.
            </p>
          </section>

          {/* 제3조 이용자 책임 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제3조 (이용자의 책임)</h2>
            <p className="text-sm">이용자는 다음 사항을 이해하고 동의한 후 서비스를 이용해야 합니다.</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                서비스가 제공하는 식단 정보는 <strong>일반 참고용</strong>이며, 실제 식이요법·치료
                계획의 대체 수단이 아닙니다. 건강 상태에 따른 식이 조정은 전문가와 상담하세요.
              </li>
              <li>
                입력한 알레르기·비선호 정보가 생성 결과에 완벽히 반영된다고 보장되지 않습니다.
                알레르기가 있는 경우 생성된 식단의 재료를 직접 확인하세요.
              </li>
              <li>
                서비스 이용 결과에 따른 식품 구매, 조리, 건강 변화 등 모든 실제 행동의 책임은
                이용자 본인에게 있습니다.
              </li>
            </ul>
          </section>

          {/* 제4조 금지 행위 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제4조 (금지 행위)</h2>
            <p className="text-sm">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>서비스 콘텐츠(식단 결과물 포함)를 운영자의 동의 없이 상업적 목적으로 복제·배포·판매하는 행위</li>
              <li>자동화 도구(봇, 크롤러 등)를 이용해 대량의 요청을 발생시키거나 서버에 과부하를 유발하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하거나 취약점을 이용해 시스템에 무단 접근하는 행위</li>
              <li>타인의 개인정보를 무단으로 입력하거나 악의적인 목적으로 서비스를 이용하는 행위</li>
              <li>관련 법령을 위반하는 방식으로 서비스를 이용하는 행위</li>
            </ul>
          </section>

          {/* 제5조 면책 범위 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제5조 (면책 범위)</h2>
            <p className="text-sm">운영자는 다음 사항에 대해 책임을 지지 않습니다.</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <strong>의료·영양 정보:</strong> 서비스가 제공하는 식단 및 영양 정보는 일반
                참고용이며, 의료·영양 전문가의 개인 맞춤 조언을 대체하지 않습니다.
              </li>
              <li>
                <strong>AI 생성 결과:</strong> 식단은 AI 모델이 생성하며, 개인의 건강 상태·
                알레르기·특수 영양 요구를 완전히 반영하지 못할 수 있습니다.
              </li>
              <li>
                <strong>서비스 중단·오류:</strong> 기술적 장애, 외부 API 오류, 점검 등으로
                인한 서비스 일시 중단 또는 결과 오류에 대해 책임을 지지 않습니다.
              </li>
              <li>
                <strong>제3자 서비스:</strong> 연동된 외부 서비스(Google, Cloudflare 등)의
                장애나 정책 변경으로 발생한 문제는 운영자의 책임 범위 밖입니다.
              </li>
              <li>
                <strong>이용 결과:</strong> 서비스 이용에 기반한 식품 구매·섭취·건강 변화 등
                실제 행동으로 발생한 손해에 대해 운영자는 책임을 지지 않습니다.
              </li>
            </ul>
            <p className="text-xs text-gray-500">
              더 자세한 면책 사항은{" "}
              <a href="/disclaimer" className="text-orange-500 underline">
                면책 고지
              </a>
              를 참고하세요.
            </p>
          </section>

          {/* 제6조 서비스 변경 및 중단 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제6조 (서비스 변경 및 중단)</h2>
            <p className="text-sm">
              운영자는 서비스 품질 개선, 운영 정책 변경, 기술적 사유 등으로 사전 공지 없이
              서비스의 일부 또는 전부를 변경하거나 중단할 수 있습니다. 서비스 변경·중단으로
              인해 이용자에게 발생한 손해에 대해 운영자는 책임을 지지 않습니다.
            </p>
          </section>

          {/* 제7조 지적재산권 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제7조 (지적재산권)</h2>
            <p className="text-sm">
              서비스의 디자인, 텍스트, UI 구성 등 모든 콘텐츠의 저작권은 운영자 또는 해당
              권리자에게 있습니다. 이용자는 개인 비상업적 목적의 이용에 한해 서비스 결과물을
              활용할 수 있습니다.
            </p>
          </section>

          {/* 제8조 약관 변경 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제8조 (약관 변경)</h2>
            <p className="text-sm">
              본 약관은 운영 정책 변경에 따라 수정될 수 있습니다. 변경 시 본 페이지 상단의
              &quot;최종 업데이트&quot; 날짜를 갱신하여 안내합니다. 변경 후 서비스를 계속
              이용하면 변경된 약관에 동의한 것으로 간주합니다.
            </p>
          </section>

          {/* 제9조 준거법 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제9조 (준거법)</h2>
            <p className="text-sm">본 약관은 대한민국 법률에 따라 해석되고 적용됩니다.</p>
          </section>

          {/* 제10조 문의 */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제10조 (문의)</h2>
            <p className="text-sm">
              약관 관련 문의는{" "}
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
