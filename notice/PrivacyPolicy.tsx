import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-white mb-4">개인정보 처리방침 (Privacy Policy)</h2>

            <p>HonglabAI(이하 "회사")는 이용자의 개인정보를 소중하게 생각하며, 개인정보 보호법에 따라 아래와 같이 처리 방침을 수립하여 공개합니다.</p>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">1. 수집하는 개인정보의 항목 및 방법</h3>
                <p>"회사"는 원활한 서비스 제공을 위해 아래 정보를 수집합니다.</p>
                <ul className="list-disc ml-5 space-y-1 mt-2">
                    <li><strong>수집 항목:</strong> 이메일 주소(ID), 비밀번호, 생년월일, MBTI 정보</li>
                    <li><strong>결제 관련:</strong> 인앱 결제 승인 번호 (직접적인 카드 정보는 수집하지 않음)</li>
                    <li><strong>데이터 저장소:</strong> 본 서비스는 이용자의 편의를 위해 '타로 기록' 등 일부 데이터를 이용자의 브라우저 로컬 스토리지(Local Storage)에 저장할 수 있습니다. 로컬 스토리지 데이터는 서버로 전송되지 않고 기기에만 저장됩니다.</li>
                    <li><strong>자동 수집 항목:</strong> 기기 식별번호(ADID/IDFA), 서비스 접속 로그, 쿠키, 이용 기록</li>
                </ul>
                <p className="mt-2"><strong>수집 방법:</strong> 앱 회원가입 시 이용자 직접 입력, 서비스 이용 시 로컬 저장소 생성, 로그 분석 툴(Google Analytics)에 의한 자동 수집</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">2. 개인정보의 수집 및 이용 목적</h3>
                <ul className="list-disc ml-5 space-y-1">
                    <li>회원 식별 및 가입 의사 확인</li>
                    <li>생년월일 및 MBTI 기반 맞춤형 타로/운세 콘텐츠 제공</li>
                    <li>유료 서비스 결제 확인 및 부정 이용 방지</li>
                    <li>신규 기능 안내 및 서비스 개선을 위한 통계 분석</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">3. 개인정보의 보유 및 이용 기간</h3>
                <p>원칙적으로 이용자의 개인정보는 회원 탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 다음과 같이 보관합니다.</p>
                <ul className="list-disc ml-5 space-y-1 mt-2">
                    <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">4. 개인정보의 파기 절차 및 방법</h3>
                <ul className="list-disc ml-5 space-y-1">
                    <li><strong>절차:</strong> 파기 사유 발생 시(회원 탈퇴 등) 재생할 수 없는 방법으로 DB에서 즉시 삭제합니다.</li>
                    <li><strong>방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">5. 개인정보의 제3자 제공 및 위탁</h3>
                <p>"회사"는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우 예외로 합니다.</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>이용자가 사전에 동의한 경우</li>
                    <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차에 따른 요청이 있는 경우</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">6. 이용자 및 법정대리인의 권리</h3>
                <ul className="list-disc ml-5 space-y-1">
                    <li>이용자는 언제든지 본인의 개인정보를 조회, 수정하거나 서비스 탈퇴를 통해 삭제를 요청할 수 있습니다.</li>
                    <li>개인정보의 오류에 대한 정정을 요청하신 경우 정정을 완료하기 전까지 해당 정보를 이용하거나 제공하지 않습니다.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">7. 개인정보의 기술적/관리적 보호 대책</h3>
                <ul className="list-disc ml-5 space-y-1">
                    <li><strong>암호화:</strong> 비밀번호는 일방향 암호화되어 저장되며, 본인만 알 수 있습니다.</li>
                    <li><strong>해킹 대비:</strong> 백신 프로그램 및 침입차단 시스템을 사용하여 정보 유출을 방지합니다.</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">8. 개인정보 보호 책임자 및 연락처</h3>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p><strong>성명:</strong> 홍은선</p>
                    <p><strong>연락처/이메일:</strong> honglabai@gmail.com</p>
                    <p className="mt-2 text-slate-400"><strong>시행 일자:</strong> 2025년 12월 25일</p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
