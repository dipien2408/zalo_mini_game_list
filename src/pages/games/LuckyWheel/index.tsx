import React, { useState, useEffect, useMemo } from 'react';
import { GameComponentProps } from '../../../types';
import { PRIZES, INITIAL_SPINS, SPIN_DURATION, Prize } from './constants';
import { spinWheel } from './logic';

const LuckyWheelGame: React.FC<GameComponentProps> = ({ onExit }) => {
  const segmentAngle = 360 / PRIZES.length;
  const initialOffset = 90 - (segmentAngle / 2);//start at 3h position

  const [rotation, setRotation] = useState<number>(initialOffset);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinsLeft, setSpinsLeft] = useState<number>(INITIAL_SPINS);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [specialCount, setSpecialCount] = useState<number>(0);
  
  const [popupResult, setPopupResult] = useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);

  useEffect(() => {
    const savedScore = localStorage.getItem('wheel_score');
    const savedSpecial = localStorage.getItem('wheel_special_count');
    if (savedScore) setTotalScore(parseInt(savedScore));
    if (savedSpecial) setSpecialCount(parseInt(savedSpecial));
  }, []);

  useEffect(() => {
    localStorage.setItem('wheel_score', totalScore.toString());
    localStorage.setItem('wheel_special_count', specialCount.toString());
  }, [totalScore, specialCount]);

  const handleSpin = () => {
    if (isSpinning) return;
    if (spinsLeft <= 0) {
      setShowDepositModal(true);
      return;
    }

    setPopupResult(null);
    setIsSpinning(true);
    setSpinsLeft((prev) => prev - 1);

    const { selectedPrize, index } = spinWheel();

    //no idea how it really works but we have to puls 1/2 segment to center the prize and add 5 round to make it spin faster.
    //so rotation = current rotation plus 360*5 plus the needed angle to center the prize, 360 - (rotation % 360) to reset current rotation to 0
    const prizeCenterAngle = (index * segmentAngle) + (segmentAngle / 2);
    const newRotation = rotation + 1800 + (360 - (rotation % 360) + (90 - prizeCenterAngle));
    setRotation(newRotation);

    setTimeout(() => {
      handleSpinEnd(selectedPrize);
    }, SPIN_DURATION + 50);
  };


  const handleSpinEnd = (prize: Prize) => {
    setIsSpinning(false);
    
    setTotalScore((prev) => prev + prize.value);
    if (prize.isSpecial) setSpecialCount((prev) => prev + 1);

    const msg = prize.value > 0 
      ? `Chúc mừng! Bạn nhận được ${prize.label}` 
      : prize.label;
    
    setPopupResult(msg);

    setTimeout(() => {
        setPopupResult(null);
    }, 2500);
  };

  const handleDeposit = (amount: number) => {
    setSpinsLeft((prev) => prev + amount);
    setShowDepositModal(false);
  };

  const wheelBackground = useMemo(() => `conic-gradient(
    ${PRIZES.map((p, i) => 
      `${p.color} ${(i * 100) / PRIZES.length}% ${((i + 1) * 100) / PRIZES.length}%`
    ).join(', ')}
  )`, []);

  return (
    <div className="flex flex-col h-full bg-slate-100 relative overflow-hidden">
      
      <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10 relative">
        <div>
          <p className="text-xs text-gray-500">Điểm tích lũy</p>
          <p className="text-xl font-bold text-blue-600">{totalScore.toLocaleString()}đ</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Vé Đặc Biệt</p>
          <p className="text-xl font-bold text-purple-600">{specialCount}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        <div className="relative w-80 h-80">
            
            <div className="absolute top-1/2 right-[-24px] transform -translate-y-1/2 z-30 drop-shadow-lg">
                <div 
                    style={{
                        width: 0, 
                        height: 0, 
                        borderTop: '15px solid transparent', 
                        borderBottom: '15px solid transparent', 
                        borderRight: '25px solid #ef4444' 
                    }}
                />
            </div>

            <div 
                className="w-full h-full rounded-full shadow-2xl border-4 border-white relative"
                style={{ 
                    background: wheelBackground,
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
                }}
            >
                {PRIZES.map((p, i) => (
                    <div
                    key={p.id}
                    className="absolute w-full text-center top-0 left-0 h-full pt-4 font-bold text-white text-xs drop-shadow-md"
                    style={{
                        transform: `rotate(${(i * segmentAngle) + (segmentAngle/2)}deg)`,
                    }}
                    >
                    <span className="block transform -rotate-90 mt-8 w-20 mx-auto bg-black/10 rounded px-1">
                        {p.label}
                    </span>
                    </div>
                ))}
                
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner z-20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning} 
          className={`mt-12 px-8 py-4 rounded-full font-bold text-white shadow-lg text-xl transform transition-all active:scale-95 z-20
            ${isSpinning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : (spinsLeft === 0 ? 'bg-orange-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500')} 
          `}
        >
          {isSpinning 
            ? 'Đang quay...' 
            : (spinsLeft === 0 ? 'NẠP LƯỢT NGAY' : `QUAY (${spinsLeft})`)}
        </button>

        <button onClick={() => setShowDepositModal(true)} className="mt-4 text-blue-600 underline text-sm z-20">
          + Mua thêm lượt
        </button>
      </div>

      <div className="p-4 bg-white z-20">
        <button onClick={onExit} className="w-full py-3 bg-gray-200 rounded-lg text-gray-600 font-bold">Thoát</button>
      </div>

      {popupResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-black/85 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce text-center backdrop-blur-sm border border-white/20">
            <span className="text-4xl block mb-3">🎉</span>
            <span className="font-bold text-xl block">{popupResult}</span>
          </div>
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-bold text-center mb-4 text-slate-800">Cần thêm lượt quay?</h3>
                <div className="space-y-3">
                  <button onClick={() => handleDeposit(2)} className="w-full py-3 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200 flex justify-between px-4 hover:bg-green-200">
                    <span>Gói Cơ Bản (2 lượt)</span>
                    <span>FREE</span>
                  </button>
                  <button onClick={() => handleDeposit(5)} className="w-full py-3 bg-yellow-100 text-yellow-700 font-bold rounded-lg border border-yellow-200 flex justify-between px-4 hover:bg-yellow-200">
                    <span>Gói VIP (5 lượt)</span>
                    <span>20.000đ</span>
                  </button>
                  <button onClick={() => handleDeposit(10)} className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 flex justify-between px-4 hover:bg-purple-200">
                    <span>Gói Đại Gia (10 lượt)</span>
                    <span>50.000đ</span>
                  </button>
              </div>
                <button onClick={() => setShowDepositModal(false)} className="mt-6 w-full py-3 text-gray-400 font-bold hover:text-gray-600">Đóng</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheelGame;