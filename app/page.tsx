'use client';

import React, { useState } from 'react';

export default function Home() {
  // 메인 폼 상태
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

  // [플랜 비교] 모달 및 단계별 상태 관리 (STEP 4)
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareStep, setCompareStep] = useState<1 | 2 | 3 | 4>(1); 
  const [selectedCategory, setSelectedCategory] = useState<'dog' | 'cat'>('dog');
  const [selectedBreed, setSelectedBreed] = useState('토이푸들 / 말티즈');
  
  // 사용자가 선택한 플랜 상태 (프리미엄 / 스탠다드 / 실속가득)
  const [selectedPlan, setSelectedPlan] = useState('스탠다드 플랜 (보상비율 70%)');
  
  // 최종 DB 저장용 신청자 정보 상태
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplicantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApplicantInfo({
      ...applicantInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleChipClick = (breedName: string) => {
    setFormData({
      ...formData,
      breed: breedName,
    });
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

  // 최종 DB 전송 핸들러
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

      if (!response.ok) {
        throw new Error(result.message || '서버 전송 실패');
      }

      alert(`🎉 [접수 완료] ${applicantInfo.name}님, [${selectedPlan}] 맞춤 견적 신청이 완료되었습니다! 담당 전문가가 연락드리겠습니다 🐾`);
      setIsCompareModalOpen(false);
      setCompareStep(1);
    } catch (error) {
      console.error(error);
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-800 font-sans">
      {/* 1. 상단 네비게이션 */}
      <header className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl">🐾</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Pet<span className="text-rose-500">Fit</span>
            </span>
            <span className="hidden sm:inline-block text-xs bg-rose-100 text-rose-600 font-bold px-2.5 py-0.5 rounded-full ml-1">
              맞춤 펫보험 비교견적
            </span>
          </div>
          <button
            onClick={() => {
              setCompareStep(1);
              setIsCompareModalOpen(true);
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition shadow-md shadow-rose-500/20"
          >
            플랜별 맞춤 비교견적
          </button>
        </div>
      </header>

      {/* 2. 메인 히어로 & 실시간 산정 폼 */}
      <section id="calc-section" className="py-12 sm:py-20 px-4 bg-gradient-to-b from-rose-100/60 via-orange-50/30 to-rose-50/20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-rose-200 px-4 py-1.5 rounded-full text-xs font-bold text-rose-600 shadow-sm">
              ✨ 내 아이 맞춤 펫보험 비교 플랫폼 PetFit
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              우리 아이에게 딱 맞는 플랜으로,<br />
              <span className="text-rose-500 underline decoration-rose-200 decoration-wavy decoration-2">
                합리적인 펫보험
              </span>을 설계해 드립니다!
            </h1>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-md bg-white/40 md:bg-transparent p-2 rounded-lg">
              복잡한 비교는 그만.<br />
              <strong>PetFit</strong>이 프리미엄, 스탠다드, 실속가득 플랜별로 최적의 보장 비율을 찾아드립니다.
            </p>
          </div>

          <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">우리 아이를 위한 최적의 설계</h2>
                <p className="text-xs text-slate-400 mt-0.5">우리 아이 정보를 입력하고 맞춤 플랜을 확인하세요.</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">반려동물 분류</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPetType('dog');
                      setFormData({ ...formData, breed: '' });
                    }}
                    className={`py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                      petType === 'dog'
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🐶 강아지 (Dog)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPetType('cat');
                      setFormData({ ...formData, breed: '' });
                    }}
                    className={`py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                      petType === 'cat'
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🐱 고양이 (Cat)
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
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">태어난 해</label>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-white"
                  >
                    {Array.from({ length: 20 }, (_, i) => 2026 - i).map((year) => (
                      <option key={year} value={year}>
                        {year}년 ({2026 - year}세)
                      </option>
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
                    className={`py-3 rounded-xl font-bold text-xs transition ${
                      formData.gender === '남아 (♂)'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    남아 ♂
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: '여아 (♀)' })}
                    className={`py-3 rounded-xl font-bold text-xs transition ${
                      formData.gender === '여아 (♀)'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
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
                  placeholder={petType === 'dog' ? "반려동물 품종 입력 (예: 말티즈)" : "반려동물 품종 입력 (예: 코숏)"}
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {petType === 'dog' ? (
                    <>
                      <button type="button" onClick={() => handleChipClick('토이푸들')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">토이푸들</button>
                      <button type="button" onClick={() => handleChipClick('포메라니안')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">포메라니안</button>
                      <button type="button" onClick={() => handleChipClick('비숑')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">비숑</button>
                      <button type="button" onClick={() => handleChipClick('말티푸')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">말티푸</button>
                      <button type="button" onClick={() => handleChipClick('말티즈 (몰티즈)')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">말티즈 (몰티즈)</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleChipClick('코리안숏헤어')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">코리안숏헤어</button>
                      <button type="button" onClick={() => handleChipClick('페르시안')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">페르시안</button>
                      <button type="button" onClick={() => handleChipClick('렉돌')} className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-2.5 py-1 rounded-full border border-rose-100 transition">렉돌</button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">체중 (몸무게)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      placeholder="예: 3.5"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                    />
                    <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-bold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">중성화 수술 여부</label>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNeutered: 'yes' })}
                      className={`py-3 rounded-xl font-bold text-xs transition ${
                        formData.isNeutered === 'yes'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      O (예)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isNeutered: 'no' })}
                      className={`py-3 rounded-xl font-bold text-xs transition ${
                        formData.isNeutered === 'no'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      X (아니오)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">결과받을 보호자 연락처</label>
                <input
                  type="tel"
                  name="ownerPhone"
                  required
                  placeholder="010-0000-0000"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-rose-500/30 transition text-base mt-2"
              >
                🔍 플랜별 맞춤 견적 확인하기
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. 왜 PetFit일까요? */}
      <section className="py-16 px-4 bg-white border-y border-rose-100/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            왜 반려인들이 <span className="text-rose-500">PetFit</span>에서 비교할까요?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <p className="text-3xl font-black text-rose-500 mb-1">15만건+</p>
              <p className="text-xs font-bold text-slate-800">누적 비교 견적 건수</p>
            </div>
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <p className="text-3xl font-black text-rose-500 mb-1">99.1%</p>
              <p className="text-xs font-bold text-slate-800">보장 매칭 만족도</p>
            </div>
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <p className="text-3xl font-black text-rose-500 mb-1">600+</p>
              <p className="text-xs font-bold text-slate-800">제휴 자동청구 병원</p>
            </div>
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <p className="text-3xl font-black text-rose-500 mb-1">최대 30%</p>
              <p className="text-xs font-bold text-slate-800">보험료 절감 효과</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 포스터 5단 섹션 */}
      <section className="w-full bg-white flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          <img src="/pet-poster-1.png" alt="포스터 1" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-2.png" alt="포스터 2" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-3.png" alt="포스터 3" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-4.png" alt="포스터 4" className="w-full h-auto block m-0 p-0" />
          <img src="/pet-poster-5.png" alt="포스터 5" className="w-full h-auto block m-0 p-0" />
        </div>
      </section>

      {/* 6. 모달 화면 (STEP 1 ~ STEP 4) */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 text-xl font-bold bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center transition"
            >
              ✕
            </button>

            {/* STEP 1 */}
            {compareStep === 1 && (
              <div className="py-2">
                <div className="text-center mb-6">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    STEP 1. 반려동물 선택
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    어떤 반려동물의 플랜을 비교할까요? 🐾
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => { setSelectedCategory('dog'); setCompareStep(2); }}
                    className="p-6 rounded-3xl border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 transition flex flex-col items-center justify-center gap-3 group"
                  >
                    <span className="text-5xl group-hover:scale-110 transition">🐶</span>
                    <span className="font-extrabold text-slate-900 text-base">강아지</span>
                  </button>
                  <button
                    onClick={() => { setSelectedCategory('cat'); setCompareStep(2); }}
                    className="p-6 rounded-3xl border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 transition flex flex-col items-center justify-center gap-3 group"
                  >
                    <span className="text-5xl group-hover:scale-110 transition">🐱</span>
                    <span className="font-extrabold text-slate-900 text-base">고양이</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {compareStep === 2 && (
              <div className="py-2">
                <div className="text-center mb-6">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    STEP 2. 품종 선택
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {selectedCategory === 'dog' ? '🐶 강아지' : '🐱 고양이'} 품종을 선택해 주세요
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {(selectedCategory === 'dog' 
                    ? ['말티즈 / 몰티즈', '토이푸들', '포메라니안', '비숑프리제', '말티푸', '치와와 / 시츄', '골든리트리버 / 대형견', '기타 믹스견']
                    : ['코리안숏헤어 (코숏)', '페르시안', '렉돌', '러시안블루', '스코티시폴드', '노르웨이숲', '먼치킨', '기타 묘종']
                  ).map((breed) => (
                    <button
                      key={breed}
                      onClick={() => { setSelectedBreed(breed); setCompareStep(3); }}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 text-xs font-bold text-slate-700 transition text-left flex items-center justify-between"
                    >
                      <span>{breed}</span>
                      <span className="text-rose-500">→</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCompareStep(1)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-2xl text-xs transition"
                >
                  ← 이전 단계로
                </button>
              </div>
            )}

            {/* STEP 3: 플랜별 선택 (프리미엄, 스탠다드, 실속가득) */}
            {compareStep === 3 && (
              <div className="py-2">
                <div className="text-center mb-5">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    STEP 3. 보장 플랜 선택
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    [{selectedBreed}] 원하는 플랜을 선택해 주세요 💡
                  </h3>
                  <p className="text-xs text-rose-500 font-bold mt-1">👇 마음에 드는 플랜 카드를 클릭하면 선택됩니다!</p>
                </div>

                {/* 🌟 플랜 선택 카드 3가지 (각각의 상단 안내 문구 추가) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  
                  {/* 프리미엄 플랜 */}
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-rose-500 text-center mb-1">✨ 가장 높은 보장 한도와 본인부담금 최소화</p>
                    <div
                      onClick={() => setSelectedPlan('프리미엄 플랜 (보상비율 70%)')}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between flex-1 ${
                        selectedPlan === '프리미엄 플랜 (보상비율 70%)'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg font-bold scale-105'
                          : 'bg-white text-slate-700 hover:border-rose-300 border-slate-200'
                      }`}
                    >
                      <div>
                        <p className={selectedPlan === '프리미엄 플랜 (보상비율 70%)' ? 'text-rose-100 text-xs' : 'text-slate-400 text-xs'}>보상비율 70%</p>
                        <p className="font-extrabold text-sm mt-1">프리미엄 플랜</p>
                      </div>
                      <p className={`font-black mt-3 text-sm ${selectedPlan === '프리미엄 플랜 (보상비율 70%)' ? 'text-white' : 'text-rose-500'}`}>월 6만 ~ 7만원</p>
                    </div>
                  </div>

                  {/* 스탠다드 플랜 */}
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-rose-500 text-center mb-1">✨ 가장 선호되는 대중적인 플랜</p>
                    <div
                      onClick={() => setSelectedPlan('스탠다드 플랜 (보상비율 70%)')}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between flex-1 ${
                        selectedPlan === '스탠다드 플랜 (보상비율 70%)'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg font-bold scale-105'
                          : 'bg-white text-slate-700 hover:border-rose-300 border-slate-200'
                      }`}
                    >
                      <div>
                        <p className={selectedPlan === '스탠다드 플랜 (보상비율 70%)' ? 'text-rose-100 text-xs' : 'text-slate-400 text-xs'}>보상비율 70% 또는 60%</p>
                        <p className="font-extrabold text-sm mt-1">스탠다드 플랜</p>
                      </div>
                      <p className={`font-black mt-3 text-sm ${selectedPlan === '스탠다드 플랜 (보상비율 70%)' ? 'text-white' : 'text-rose-500'}`}>월 5만 ~ 6만원</p>
                    </div>
                  </div>

                  {/* 실속가득 플랜 */}
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-rose-500 text-center mb-1">✨ 합리적인 보험료 중심의 실속형 플랜</p>
                    <div
                      onClick={() => setSelectedPlan('실속가득 플랜 (보상비율 50%)')}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between flex-1 ${
                        selectedPlan === '실속가득 플랜 (보상비율 50%)'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-lg font-bold scale-105'
                          : 'bg-white text-slate-700 hover:border-rose-300 border-slate-200'
                      }`}
                    >
                      <div>
                        <p className={selectedPlan === '실속가득 플랜 (보상비율 50%)' ? 'text-rose-100 text-xs' : 'text-slate-400 text-xs'}>보상비율 50%</p>
                        <p className="font-extrabold text-sm mt-1">실속가득 플랜</p>
                      </div>
                      <p className={`font-black mt-3 text-sm ${selectedPlan === '실속가득 플랜 (보상비율 50%)' ? 'text-white' : 'text-rose-500'}`}>월 3만 ~ 4만원</p>
                    </div>
                  </div>

                </div>

                {/* 빨간 안내 문구 */}
                <div className="mb-5 text-center">
                  <p className="text-[11px] font-bold text-red-500">
                    ⚠️ 실제 보험료는 반려동물의 품종, 나이 등에 따라 상이할 수 있습니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center text-xs font-bold text-rose-600 mb-2">
                    ✨ 선택된 플랜: <span className="underline text-sm">{selectedPlan}</span>
                  </div>
                  <button
                    onClick={() => setCompareStep(4)}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl transition text-sm shadow-lg shadow-rose-500/25"
                  >
                    💌 이 플랜으로 맞춤 견적 리포트 무료 신청하기
                  </button>
                  <button
                    onClick={() => setCompareStep(2)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs transition"
                  >
                    ← 다른 품종 선택하기
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: 최종 DB 신청 폼 */}
            {compareStep === 4 && (
              <form onSubmit={handleDbSubmit} className="py-2">
                <div className="text-center mb-5">
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">
                    STEP 4. 무료 리포트 신청 폼
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    [{selectedPlan}] 최종 맞춤 견적 신청
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    선택하신 플랜과 상담 방식을 확인 후 접수해 주세요.
                  </p>
                </div>

                <div className="space-y-3.5 mb-6 max-h-[380px] overflow-y-auto pr-1">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">우리 아이 이름</label>
                      <input
                        type="text"
                        name="petName"
                        required
                        placeholder="예: 초코"
                        value={applicantInfo.petName}
                        onChange={handleApplicantChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">보호자 성함</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="예: 홍길동"
                        value={applicantInfo.name}
                        onChange={handleApplicantChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">휴대폰 번호</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="010-0000-0000"
                        value={applicantInfo.phone}
                        onChange={handleApplicantChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">최종 체중 (kg)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          name="weight"
                          placeholder="예: 3.5"
                          value={applicantInfo.weight}
                          onChange={handleApplicantChange}
                          className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kg</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">반려동물 성별</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, gender: '남아 (♂)' })}
                        className={`py-2.5 rounded-xl font-bold text-xs transition ${
                          applicantInfo.gender === '남아 (♂)'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        남아 ♂
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, gender: '여아 (♀)' })}
                        className={`py-2.5 rounded-xl font-bold text-xs transition ${
                          applicantInfo.gender === '여아 (♀)'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        여아 ♀
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">중성화 수술 여부</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, isNeutered: 'yes' })}
                        className={`py-2.5 rounded-xl font-bold text-xs transition ${
                          applicantInfo.isNeutered === 'yes'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        O (예)
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, isNeutered: 'no' })}
                        className={`py-2.5 rounded-xl font-bold text-xs transition ${
                          applicantInfo.isNeutered === 'no'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        X (아니오)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">상담 방법 선택</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, consultType: 'online' })}
                        className={`p-3 rounded-xl font-bold text-xs transition border flex flex-col items-center justify-center gap-1 ${
                          applicantInfo.consultType === 'online'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base">💻 온라인 (화상 상담)</span>
                        <span className="text-[10px] opacity-80">비대면으로 편하게 진행</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setApplicantInfo({ ...applicantInfo, consultType: 'offline' })}
                        className={`p-3 rounded-xl font-bold text-xs transition border flex flex-col items-center justify-center gap-1 ${
                          applicantInfo.consultType === 'offline'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base">🤝 대면 (직접 상담)</span>
                        <span className="text-[10px] opacity-80">전문가 방문/내방 안내</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">추가 요청사항 (선택)</label>
                    <textarea
                      name="memo"
                      rows={2}
                      placeholder="예: 슬개골 보장이 튼튼한 상품 위주로 부탁드려요."
                      value={applicantInfo.memo}
                      onChange={handleApplicantChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm resize-none"
                    />
                  </div>

                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl transition text-sm shadow-lg shadow-rose-500/25"
                  >
                    🚀 최종 견적 접수 완료하기
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareStep(3)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs transition"
                  >
                    ← 플랜 선택으로 돌아가기
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-lg">🐾</span>
            <span className="text-lg font-black text-white">PetFit</span>
          </div>
          <p>© 2026 PetFit Inc. All rights reserved.</p>
          <p className="text-slate-500 text-[11px]">
            PetFit은 반려견·반려묘의 보장 플랜을 한눈에 비교·분석해 드리는 스마트 펫케어 통합 플랫폼입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}