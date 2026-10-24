import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log('-------------------------------------------');
    console.log('🎉 [PetFit 신규 견적 신청 DB 수신 완료!]');
    console.log(`- 보호자 성함: ${data.applicantName}`);
    console.log(`- 연락처: ${data.applicantPhone}`);
    console.log(`- 반려동물: ${data.petName} (${data.breed}, ${data.petType})`);
    console.log(`- 선택 보험사: ${data.selectedInsurance || '미선택'}`);
    console.log(`- 체중 / 중성화: ${data.weight}kg / ${data.isNeutered === 'yes' ? 'O' : 'X'}`);
    console.log(`- 상담 방식: ${data.consultType}`);
    console.log(`- 추가 메모: ${data.memo || '없음'}`);
    console.log('-------------------------------------------');

    // 📧 구글 메일 전송 설정 (Nodemailer)
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
            <li><b>📌 신청 보험사:</b> <span style="color: #f43f5e; font-weight: bold;">${data.selectedInsurance || '미선택'}</span></li>
            <li><b>👤 보호자 성함:</b> ${data.applicantName}</li>
            <li><b>📞 연락처:</b> ${data.applicantPhone}</li>
            <li><b>🐶 반려동물 이름:</b> ${data.petName}</li>
            <li><b>🏷️ 품종 / 분류:</b> ${data.breed} (${data.petType === 'dog' ? '강아지' : '고양이'})</li>
            <li><b>📅 태어난 해:</b> ${data.birthYear}년</li>
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

    return NextResponse.json({ success: true, message: '데이터 수신 및 이메일 전송 완료' });
  } catch (error) {
    console.error('❌ [이메일 전송 실패 오류]:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}