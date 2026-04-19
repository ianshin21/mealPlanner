import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "이용약관",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">이용약관</h1>

        <div className="text-sm text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">최종 업데이트: 2024년 1월</p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제1조 (목적)</h2>
            <p>
              본 약관은 자동 식단 생성기 서비스(이하 &quot;서비스&quot;) 이용에 관한
              조건 및 절차를 규정합니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제2조 (서비스 내용)</h2>
            <p>서비스는 다음을 제공합니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>1인·2인 가정용 자동 식단 생성 (14일 또는 28일)</li>
              <li>점심·저녁 메뉴 자동 구성</li>
              <li>끼니별 메뉴 교체 기능</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제3조 (이용 제한)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>본 서비스를 상업적 목적으로 무단 복제·배포하는 행위</li>
              <li>서비스 운영을 방해하는 행위</li>
              <li>허위 정보를 입력하여 서비스를 악용하는 행위</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제4조 (면책)</h2>
            <p>
              본 서비스는 일반 건강 참고용 정보를 제공하며, 의료·영양 전문가의 조언을
              대체하지 않습니다. 서비스 이용으로 발생한 건강 관련 결과에 대해 서비스
              운영자는 책임지지 않습니다. 자세한 내용은{" "}
              <a href="/disclaimer" className="text-orange-500 underline">
                면책 고지
              </a>
              를 참고하세요.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제5조 (서비스 변경 및 중단)</h2>
            <p>
              운영자는 사전 고지 없이 서비스의 일부 또는 전부를 변경하거나 중단할 수
              있습니다. 서비스 중단으로 인한 손해에 대해 운영자는 책임지지 않습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900">제6조 (준거법)</h2>
            <p>본 약관은 대한민국 법률에 따라 해석됩니다.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
