import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-white mb-4">이용약관 (Terms of Service)</h2>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">제 1 장 총칙</h3>
                <p className="font-medium text-slate-200">제1조 (목적)</p>
                <p>본 약관은 HonglabAI(이하 "회사")가 제공하는 MBTI 타로 운세 서비스 및 관련 제반 서비스(이하 "서비스")를 이용함에 있어 "회사"와 "이용자"의 권리, 의무 및 책임 사항, 서비스 이용 조건 및 절차 등 기본적인 사항을 규정함을 목적으로 합니다.</p>
            </section>

            <section>
                <p className="font-medium text-slate-200">제2조 (용어의 정의)</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>"서비스"라 함은 "회사"가 구현하여 앱을 통해 제공하는 MBTI 기반 타로 및 운세 콘텐츠 일체를 의미합니다.</li>
                    <li>"이용자"란 본 약관에 동의하고 "회사"가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                    <li>"유료 서비스"란 "회사"가 유료로 제공하는 각종 디지털 콘텐츠(타로 결과 보기, 수정구슬 및 코인 충전 등)를 의미합니다.</li>
                </ul>
            </section>

            <section>
                <p className="font-medium text-slate-200">제3조 (약관의 효력 및 변경)</p>
                <ol className="list-decimal ml-5 space-y-1">
                    <li>본 약관은 앱 내 가입 화면에 게시하여 이용자가 동의함으로써 효력이 발생합니다.</li>
                    <li>"회사"는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용 일자 7일 전(중요한 변경은 30일 전)에 앱 내 공지사항을 통해 고지합니다.</li>
                </ol>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">제 2 장 서비스 이용 계약</h3>
                <p className="font-medium text-slate-200">제4조 (회원가입 및 정보 변경)</p>
                <ol className="list-decimal ml-5 space-y-1">
                    <li>이용자는 "회사"가 정한 가입 양식에 따라 이메일, 생년월일, 비밀번호, MBTI 등의 정보를 입력하고 약관에 동의함으로써 회원가입을 신청합니다.</li>
                    <li>본 서비스는 만 14세 미만 아동의 가입을 제한할 수 있습니다.</li>
                    <li>회원은 개인정보 관리화면을 통해 언제든지 본인의 정보를 열람하고 수정할 수 있습니다.</li>
                </ol>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">제 3 장 서비스 이용 및 유료 결제</h3>
                <p className="font-medium text-slate-200">제5조 (서비스 제공 및 면책)</p>
                <ol className="list-decimal ml-5 space-y-1">
                    <li>"서비스"는 이용자가 입력한 MBTI 및 생년월일 정보를 분석하여 타로 결과를 제공합니다.</li>
                    <li className="text-amber-200 font-bold">본 서비스에서 제공하는 모든 타로 및 운세 결과는 엔터테인먼트 목적으로만 제공됩니다. 결과의 과학적 근거를 보장하지 않으며, 이 결과에 따른 이용자의 결정이나 행동에 대해 "회사"는 어떠한 법적 책임도 지지 않습니다.</li>
                    <li>이용자는 본 서비스의 결과를 맹신하지 말고, 참고용으로만 활용해야 합니다.</li>
                </ol>
            </section>

            <section>
                <p className="font-medium text-slate-200">제6조 (인앱 결제 및 청약철회)</p>
                <ol className="list-decimal ml-5 space-y-1">
                    <li>유료 서비스 결제는 구글 플레이스토어, 애플 앱스토어의 결제 정책을 따릅니다.</li>
                    <li>청약철회(환불) 규정:
                        <ul className="list-disc ml-5 mt-1">
                            <li>구매 후 사용하지 않은 유료 재화(코인 등)는 구매일로부터 7일 이내에 환불을 요청할 수 있습니다.</li>
                            <li>단, 디지털 콘텐츠 특성상 타로 결과를 확인하거나 이미 사용된 콘텐츠는 전자상거래법 제17조 제2항에 의거하여 청약철회가 제한됩니다.</li>
                        </ul>
                    </li>
                    <li>환불 절차는 각 앱 스토어의 환불 정책 및 절차에 따라 진행됩니다.</li>
                </ol>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">제 4 장 계약 해지 및 분쟁 해결</h3>
                <p className="font-medium text-slate-200">제7조 (계약 해지)</p>
                <p>회원은 언제든지 서비스 내 "탈퇴하기" 기능을 통해 이용 계약을 해지할 수 있습니다. 탈퇴 시 보유한 유료 재화는 소멸하며 복구되지 않습니다.</p>
            </section>

            <section>
                <p className="font-medium text-slate-200">제8조 (준거법 및 재판관할)</p>
                <p>본 약관은 대한민국 법령에 의하여 해석되며, 서비스 이용과 관련하여 발생한 분쟁은 "회사"의 본점 소재지 관할 법원을 합의 관할 법원으로 합니다.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
