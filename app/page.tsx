'use client';

import React, { useState, useRef } from 'react';

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [formData, setFormData] = useState({
    petName: '',
    birthYear: '2024',
    breed: '',
    weight: '',
    isNeutered: 'yes',
    gender: '남아 (♂)',
    ownerPhone: '',
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareStep, setCompareStep] = useState<1 | 2 | 3 | 4>(1); 
  const [selectedCategory, setSelectedCategory] = useState<'dog' | 'cat'>('dog');
  const [selectedBreed, setSelectedBreed] = useState('토이푸들 / 말티즈');
  const [selectedPlan, setSelectedPlan] = useState('스탠다드 플랜 (보상비율 70%)');
  
  const [applicantInfo, setApplicantInfo] = useState({
    petName: '',
    name: '',
    phone: '',
    weight: '',
    isNeutered: 'yes',
    gender: '남아 (♂)',
    consultType: 'online', 
    memo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplicantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApplicantInfo({ ...applicantInfo, [e.target.name]: e.target.value });
  };

  const handleChipClick = (breedName: string) => {
    setFormData({ ...formData, breed: breedName });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petName || !formData.ownerPhone || !formData.breed) {
      alert('우리 아이 이름, 품종, 그리고 보호자님의 연락처를 입력해 주세요 🐾');
      return;
    }
    setSelectedCategory(petType);
    setSelectedBreed(formData.breed);
    
    setApplicantInfo({
      ...applicantInfo,
      petName: formData.petName,
      weight: formData.weight,
      isNeutered: formData.isNeutered,
      gender: formData.gender,
      phone: formData.ownerPhone,
    });

    setCompareStep(3);
    setIsCompareModalOpen(true);
  };

  const handleDbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantInfo.name || !applicantInfo.phone) {
      alert('보호자 성함과 연락처를 정확히 입력해 주세요!');
      return;
    }

    const payload = {
      petType: selectedCategory,
      breed: selectedBreed,
      petName: applicantInfo.petName || formData.petName || '미입력',
      birthYear: formData.birthYear,
      weight: applicantInfo.weight,
      isNeutered: applicantInfo.isNeutered,
      gender: applicantInfo.gender,
      applicantName: applicantInfo.name,
      applicantPhone: applicantInfo.phone,
      consultType: applicantInfo.consultType === 'online' ? '온라인 (화상)' : '대면 (직접)',
      selectedInsurance: selectedPlan,
      memo: applicantInfo.memo,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/petfit-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || '서버 전송 실패');

      alert(`🎉 [접수 완료] ${applicantInfo.name}님, [${selectedPlan}] 맞춤 견적 신청이 완료되었습니다!`);
      setIsCompareModalOpen(false);
      setCompareStep(1);
    } catch (error) {
      console.error(error);
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-500 selection:text-white pb-28 sm:pb-0">
      {/* 상단 네비게이션 */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🐾</span>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Pet<span className="text-rose-500">Fit</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] bg-rose-50 text-rose-600 font-bold px-2.5 py-0.5 rounded-full border border-rose-100">
              맞춤 펫보험 비교
            </span>
          </div>
          <button
            onClick={() => { setCompareStep(1); setIsCompareModalOpen(true); }}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition shadow-lg shadow-rose-500/20 active:scale-95"
          >
            플랜별 맞춤 비교견적
          </button>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 좌측 히어로 카드 */}
          <div className="lg:col-span-8 bg-gradient-to-br from-white via-rose-50/20 to-orange-50/20 rounded-[2.5rem] p-6 sm:p-12 shadow-xl border border-rose-100/70 flex flex-col justify-between relative overflow-hidden">
            
            <div className="grid lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-sm">
                  ✨ 대한민국 No.1 펫보험 비교 플랫폼
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 leading-[1.2] tracking-tight">
                  우리 아이에게 딱 맞는 플랜으로,<br />
                  <span className="text-rose-500 underline decoration-rose-200 decoration-wavy decoration-2">합리적인 펫보험</span> 설계
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  복잡한 병원비 고민은 그만. PetFit이 프리미엄, 스탠다드, 실속가득 플랜별 최적의 보장 비율을 찾아드립니다.
                </p>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] lg:max-w-none rounded-2xl overflow-hidden shadow-lg bg-white p-2 border border-rose-100/80 transform hover:scale-[1.02] transition-transform">
                  <img 
                    src="/main-poster.png" 
                    alt="강아지와 고양이" 
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-20 mt-8 pt-6 border-t border-rose-100/60">
              <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-rose-100 shadow-sm">
                <p className="text-xs font-extrabold text-rose-500 mb-3 flex items-center gap-1">
                  <span>🔥</span> PetFit만의 핵심 혜택
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-bold text-slate-700">
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/60 flex items-center gap-2">
                    <span>🏥</span> 24시 제휴보장
                  </div>
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/60 flex items-center gap-2">
                    <span>⚡</span> 간편 청구
                  </div>
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/60 flex items-center gap-2">
                    <span>🛡️</span> 슬개골·피부
                  </div>
                  <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/60 flex items-center gap-2">
                    <span>💰</span> 최대 30% 절감
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 우측 정보 입력 폼 카드 */}
          <div ref={formRef} className="lg:col-span-4 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-100 lg:sticky lg:top-24 flex flex-col justify-center scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">맞춤 견적 간편 신청</h2>
                <p className="text-xs text-slate-400 mt-0.5">우리 아이 정보를 입력해 주세요.</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">반려동물 분류</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPetType('dog'); setFormData({ ...formData, breed: '' }); }}
                    className={`py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      petType === 'dog' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🐶 강아지
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPetType('cat'); setFormData({ ...formData, breed: '' }); }}
                    className={`py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      petType === 'cat' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🐱 고양이
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">우리 아이 이름</label>
                  <input
                    type="text"
                    name="petName"
                    required
                    placeholder="예: 초코"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">태어난 해</label>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs bg-white transition"
                  >
                    {Array.from({ length: 20 }, (_, i) => 2026 - i).map((year) => (
                      <option key={year} value={year}>{year}년 ({2026 - year}세)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">반려동물 성별</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: '남아 (♂)' })}
                    className={`py-3 rounded-xl font-bold text-xs transition ${formData.gender === '남아 (♂)' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    남아 ♂
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: '여아 (♀)' })}
                    className={`py-3 rounded-xl font-bold text-xs transition ${formData.gender === '여아 (♀)' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    여아 ♀
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">품종</label>
                <input
                  type="text"
                  name="breed"
                  required
                  placeholder={petType === 'dog' ? "예: 말티즈" : "예: 코리안숏헤어"}
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm transition"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {petType === 'dog' ? (
                    ['토이푸들', '포메라니안', '비숑', '말티즈', '골든리트리버'].map(breed => (
                      <button key={breed} type="button" onClick={() => handleChipClick(breed)} className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">{breed}</button>
                    ))
                  ) : (
                    ['코리안숏헤어', '페르시안', '렉돌', '먼치킨'].map(breed => (
                      <button key={breed} type="button" onClick={() => handleChipClick(breed)} className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">{breed}</button>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">체중 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    placeholder="예: 3.5"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">중성화 여부</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNeutered: 'yes' })}
                      className={`py-3 rounded-xl font-bold text-xs transition ${formData.isNeutered === 'yes' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                    >
                      O
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNeutered: 'no' })}
                      className={`py-3 rounded-xl font-bold text-xs transition ${formData.isNeutered === 'no' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">보호자 연락처</label>
                <input
                  type="tel"
                  name="ownerPhone"
                  required
                  placeholder="010-0000-0000"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-rose-500/30 transition text-base mt-3 active:scale-[0.98]"
              >
                🔍 플랜별 맞춤 견적 확인하기
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 🌟 모바일 하단 안전영역 고려한 고정(Fixed) 플로팅 "신청하기" 배지 바 */}
      <div className="fixed bottom-6 left-4 right-4 z-50 sm:hidden">
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center justify-between gap-3 animate-bounce">
          <div>
            <p className="text-xs font-bold text-slate-200">우리 아이 맞춤 보험료는?</p>
            <p className="text-[11px] text-rose-400 font-extrabold">1분 만에 무료 견적 확인하기</p>
          </div>
          <button
            onClick={scrollToForm}
            className="bg-rose-500 hover:bg-rose-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-rose-500/40 active:scale-95 transition flex-shrink-0"
          >
            ✨ 신청하기
          </button>
        </div>
      </div>

      <section className="py-16 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            왜 반려인들이 <span className="text-rose-500">PetFit</span>에서 비교할까요?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-3xl font-black text-rose-500 mb-1">15만건+</p>
              <p className="text-xs font-bold text-slate-700">누적 비교 견적 건수</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-3xl font-black text-rose-500 mb-1">99.1%</p>
              <p className="text-xs font-bold text-slate-700">보장 매칭 만족도</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-3xl font-black text-rose-500 mb-1">600+</p>
              <p className="text-xs font-bold text-slate-700">제휴 자동청구 병원</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-3xl font-black text-rose-500 mb-1">최대 30%</p>
              <p className="text-xs font-bold text-slate-700">보험료 절감 효과</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white flex flex-col items-center py-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          <img src="/pet-poster-1.png" alt="포스터 1" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-2.png" alt="포스터 2" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-3.png" alt="포스터 3" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-4.png" alt="포스터 4" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-5.png" alt="포스터 5" className="w-full h-auto block m-0 p-0" />
        </div>
      </section>

      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 text-xl font-bold bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center transition"
            >
              ✕
            </button>

            {compareStep === 1 && (
              <div className="py-2">
                <div className="text-center mb-6">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">STEP 1</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">어떤 반려동물의 플랜을 비교할까요? 🐾</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button onClick={() => { setSelectedCategory('dog'); setCompareStep(2); }} className="p-6 rounded-3xl border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 transition flex flex-col items-center justify-center gap-3">
                    <span className="text-5xl">🐶</span>
                    <span className="font-extrabold text-slate-900 text-base">강아지</span>
                  </button>
                  <button onClick={() => { setSelectedCategory('cat'); setCompareStep(2); }} className="p-6 rounded-3xl border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 transition flex flex-col items-center justify-center gap-3">
                    <span className="text-5xl">🐱</span>
                    <span className="font-extrabold text-slate-900 text-base">고양이</span>
                  </button>
                </div>
              </div>
            )}

            {compareStep === 2 && (
              <div className="py-2">
                <div className="text-center mb-6">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">STEP 2</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{selectedCategory === 'dog' ? '🐶 강아지' : '🐱 고양이'} 품종 선택</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {(selectedCategory === 'dog' 
                    ? ['말티즈', '토이푸들', '포메라니안', '비숑프리제', '말티푸', '치와와 / 시츄', '골든리트리버', '기타 믹스견']
                    : ['코리안숏헤어', '페르시안', '렉돌', '러시안블루', '스코티시폴드', '노르웨이숲', '먼치킨', '기타 묘종']
                  ).map((breed) => (
                    <button key={breed} onClick={() => { setSelectedBreed(breed); setCompareStep(3); }} className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 text-xs font-bold text-slate-700 transition text-left flex items-center justify-between">
                      <span>{breed}</span>
                      <span className="text-rose-500">→</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setCompareStep(1)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-2xl text-xs transition">← 이전 단계</button>
              </div>
            )}

            {compareStep === 3 && (
              <div className="py-2">
                <div className="text-center mb-5">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">STEP 3</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">[{selectedBreed}] 보장 플랜 선택 💡</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { title: '프리미엄 플랜', desc: '보상비율 70%', price: '월 6만~7만' },
                    { title: '스탠다드 플랜', desc: '보상비율 70/60%', price: '월 5만~6만' },
                    { title: '실속가득 플랜', desc: '보상비율 50%', price: '월 3만~4만' }
                  ].map((plan) => (
                    <div key={plan.title} onClick={() => setSelectedPlan(`${plan.title} (${plan.desc})`)} className={`p-4 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between ${selectedPlan.includes(plan.title) ? 'bg-rose-500 text-white border-rose-500 shadow-lg scale-105 font-bold' : 'bg-white text-slate-700 border-slate-200'}`}>
                      <div>
                        <p className={selectedPlan.includes(plan.title) ? 'text-rose-100 text-xs' : 'text-slate-400 text-xs'}>{plan.desc}</p>
                        <p className="font-extrabold text-sm mt-1">{plan.title}</p>
                      </div>
                      <p className={`font-black mt-3 text-sm ${selectedPlan.includes(plan.title) ? 'text-white' : 'text-rose-500'}`}>{plan.price}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCompareStep(4)} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl transition text-sm shadow-lg shadow-rose-500/25">
                  💌 이 플랜으로 무료 리포트 신청하기
                </button>
              </div>
            )}

            {compareStep === 4 && (
              <form onSubmit={handleDbSubmit} className="py-2">
                <div className="text-center mb-5">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">STEP 4</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">최종 맞춤 견적 신청</h3>
                </div>
                <div className="space-y-3.5 mb-6 max-h-[380px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">우리 아이 이름</label>
                      <input type="text" name="petName" required value={applicantInfo.petName} onChange={handleApplicantChange} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">보호자 성함</label>
                      <input type="text" name="name" required placeholder="홍길동" value={applicantInfo.name} onChange={handleApplicantChange} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">휴대폰 번호</label>
                    <input type="tel" name="phone" required placeholder="010-0000-0000" value={applicantInfo.phone} onChange={handleApplicantChange} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">상담 방법</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setApplicantInfo({ ...applicantInfo, consultType: 'online' })} className={`p-3 rounded-xl font-bold text-xs border ${applicantInfo.consultType === 'online' ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>💻 온라인 상담</button>
                      <button type="button" onClick={() => setApplicantInfo({ ...applicantInfo, consultType: 'offline' })} className={`p-3 rounded-xl font-bold text-xs border ${applicantInfo.consultType === 'offline' ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>🤝 대면 상담</button>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl transition text-sm shadow-lg shadow-rose-500/25">
                  🚀 최종 견적 접수 완료하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 text-xs py-10 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-lg">🐾</span>
            <span className="text-lg font-black text-white">PetFit</span>
          </div>
          <p>© 2026 PetFit Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}