import React from 'react';

const MarketingStatus: React.FC = () => {
    return (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-white mb-4">마케팅 정보 수신 동의 (Optional)</h2>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">1. 수신 동의 목적</h3>
                <p>회사가 제공하는 이벤트, 혜택 정보, 신규 서비스 안내 등 홍보성 정보를 이용자에게 제공하기 위함입니다.</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">2. 수집 항목</h3>
                <p>닉네임, 이메일 주소, 서비스 이용 기록, MBTI 정보.</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">3. 보유 및 이용 기간</h3>
                <p className="font-medium text-slate-200">회원 탈퇴 시 또는 수신 동의 철회 시까지</p>
                <p>단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">4. 동의 거부 권리</h3>
                <p>귀하는 본 마케팅 정보 수신 동의를 거부할 권리가 있습니다. 동의를 거부하더라도 서비스 이용에는 제한이 없으나, 앱에서 제공하는 맞춤형 이벤트 및 혜택 알림을 받지 못할 수 있습니다.</p>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">5. 동의 철회 방법</h3>
                <p>서비스 내 '마이페이지' 설정 메뉴 또는 고객센터를 통해 언제든지 수신 동의를 철회할 수 있습니다.</p>
            </section>
        </div>
    );
};

export default MarketingStatus;
