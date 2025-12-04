// src/pages/games/MathQuiz/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { generateQuestion } from './logic';
import { Question } from '@/types/mathQuiz';
import { GameComponentProps } from '@/types';

const MAX_TIME = 10; 

const MathQuizGame: React.FC<GameComponentProps> = ({ onExit }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(MAX_TIME);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    const savedHighScore = localStorage.getItem('mathQuizHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10)); //decimal
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('mathQuizHighScore', score.toString());
    }
  },[score, highScore]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if(isPlaying && timeLeft > 0 && !isGameOver) {
      //timer reduce by 1 every second
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) { 
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, isGameOver, handleGameOver]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    nextRound();
  };
  const nextRound = () => {
    setQuestion(generateQuestion());
    setTimeLeft(MAX_TIME);
  };
  const handleAnswer = (isCorrect: boolean) => {
    if(isGameOver) return;
    if(isCorrect) {
      setScore((prev) => prev + 1);
      nextRound();
    } else {
      handleGameOver();
    }
  };

  //game over screen
  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 animate-fadeIn">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Kết thúc!</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full text-center mb-6">
          <p className="text-gray-500">Điểm của bạn</p>
          <p className="text-5xl font-bold text-blue-600 mb-4">{score}</p>
          <div className="border-t pt-2">
            <p className="text-sm text-gray-400">Kỷ lục: {highScore}</p>
          </div>
        </div>
        <div className="flex gap-4 w-full">
            <button onClick={onExit} className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-bold">Thoát</button>
            <button onClick={startGame} className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold shadow-lg">Chơi lại</button>
        </div>
      </div>
    );
  }

  //start screen
  if (!isPlaying && !question) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="text-6xl mb-6">🧮</div>
            <h1 className="text-2xl font-bold mb-2">Toán Học Vui</h1>
            <p className="text-center text-gray-500 mb-8">Bạn có 10 giây/câu.<br/>Sai là thua!</p>
            <button onClick={startGame} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg animate-bounce">Bắt đầu ngay</button>
            <button onClick={onExit} className="mt-4 text-gray-400 underline">Quay lại</button>
        </div>
     )
  }

  //playing screen
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase">Điểm</p>
          <p className="text-2xl font-bold text-blue-600">{score}</p>
        </div>
        <div className="flex-1 mx-4">
             <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(timeLeft / MAX_TIME) * 100}%` }}
                />
             </div>
             <p className="text-center text-xs text-gray-400 mt-1">{timeLeft}s</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase">Kỷ lục</p>
          <p className="text-xl font-bold text-orange-500">{highScore}</p>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="text-5xl font-bold text-slate-700 tracking-wider">
          {question?.text}
        </div>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {question?.answers.map((ans, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(ans.isCorrect)}
            className="w-full py-4 bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 rounded-xl text-xl font-bold text-gray-700 shadow-sm active:scale-95 transition-all"
          >
            {ans.value}
          </button>
        ))}
      </div>
    </div>
  );


}

export default MathQuizGame;