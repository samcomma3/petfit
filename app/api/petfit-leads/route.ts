import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function formatBirthDate(birthDate?: string) {
  if (!birthDate) return '미입력';

  const parts = String(birthDate).split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${year}년 ${month}월 ${day}일`;
  }

  return String(birthDate);
}

async function appendToGoogleSheet(payload: Record<string, unknown>) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('⚠️ GOOGLE_SHEET_WEBHOOK_URL 환경 변수가 설정되지 않았습니다.');
    return;
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`스프레드시트 응답 오류: ${res.status}`);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const formattedBirthDate = formatBirthDate(data.birthDate);

    // 1. 구글 스프레드시트 자동 기입
    try {
      await appendToGoogleSheet(data);
      console.log('✅ [구글 스프레드시트 기록 성공]');
    } catch (sheetError) {
      console.error('❌ [구글 스프레드시트 기록 실패]:', sheetError);
    }

    // 2. 기존 이메일 알림 발송
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'terryjun95@gmail.com , cozyjk00@gmail.com',
      subject: `🐾 [PetFit] 새로운 펫보험 상담 신청이 접수되었습니다! (${data.applicantName}님)`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ffe4e6; border-radius: 10px; background-color: #fff1f2;">
          <h2 style="color: #f43f5e;">🐶 PetFit 신규 고객 상담 신청서</h2>
          <p>새로운 고객이 맞춤 펫보험 견적 및 상담을 신청했습니다.</p>
          <hr style="border: 0; border-top: 1px solid #fecdd3; margin: 15px 0;" />
          <ul style="list-style: none; padding: 0; line-height: 1.8; color: #334155;">
            <li><b>📌 신청 플랜:</b> <span style="color: #f43f5e; font-weight: bold;">${data.selectedInsurance || '미선택'}</span></li>
            <li><b>👤 보호자 성함:</b> ${data.applicantName}</li>
            <li><b>📞 연락처:</b> ${data.applicantPhone}</li>
            <li><b>🐶 반려동물 이름:</b> ${data.petName}</li>
            <li><b>🏷️ 품종 / 분류:</b> ${data.breed} (${data.petType === 'dog' ? '강아지' : '고양이'})</li>
            <li><b>🐾 성별:</b> <span style="color: #f43f5e; font-weight: bold;">${data.gender || '미입력'}</span></li>
            <li><b>📅 생년월일:</b> ${formattedBirthDate}</li>
            <li><b>⚖️ 체중:</b> ${data.weight || '미입력'} kg</li>
            <li><b>✂️ 중성화 여부:</b> ${data.isNeutered === 'yes' ? 'O (예)' : 'X (아니오)'}</li>
            <li><b>💬 상담 방식:</b> ${data.consultType}</li>
            <li><b>📝 추가 요청사항:</b> ${data.memo || '없음'}</li>
          </ul>
          <hr style="border: 0; border-top: 1px solid #fecdd3; margin: 15px 0;" />
          <p style="font-size: 12px; color: #888;">본 메일은 PetFit 플랫폼에서 자동으로 발송되었습니다.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ [이메일 전송 성공]: terryjun95@gmail.com , cozyjk00@gmail.com');

    return NextResponse.json({ success: true, message: '시트 기록 및 이메일 전송 완료' });
  } catch (error) {
    console.error('❌ [처리 실패 오류]:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}