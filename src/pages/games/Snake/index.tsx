import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameComponentProps } from '@/types';
import { GRID_SIZE, SPEED, Position, Direction } from './constants';

const SnakeGame: React.FC<GameComponentProps> = ({ onExit }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const directionRef = useRef<Direction>('RIGHT');

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const generateFood = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  }
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };
        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if(
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE 
        ) {
          handleGameOver();
          return prevSnake;
        }

        //snake length must > 2 to bite himself
        if(prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(moveSnake);  
  }, [isPaused, isGameOver, food, handleGameOver]);

  const changeDirection = (newDirection: Direction) => {
    const currentDirection = directionRef.current;
    if (newDirection === 'UP' && currentDirection === 'DOWN') return;
    if (newDirection === 'DOWN' && currentDirection === 'UP') return;
    if (newDirection === 'LEFT' && currentDirection === 'RIGHT') return;
    if (newDirection === 'RIGHT' && currentDirection === 'LEFT') return;
    setDirection(newDirection);
    directionRef.current = newDirection;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-4 items-center overflow-hidden">
      
      <div className="w-full flex justify-between items-center mb-4 bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700">
        <div className="text-center">
            <p className="text-xs text-slate-400 uppercase">Điểm</p>
            <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div className="text-center">
            <p className="text-xs text-slate-400 uppercase">Kỷ lục</p>
            <p className="text-xl font-bold text-orange-400">{highScore}</p>
        </div>
        <button onClick={onExit} className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
            Quay lại
        </button>
      </div>

      <div 
        className="relative bg-slate-800 border-4 border-slate-600 rounded-lg shadow-2xl"
        style={{
            width: '300px', 
            height: '300px',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {(isPaused || isGameOver) && (
            <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
                {isGameOver ? (
                    <h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2>
                ) : (
                    <h2 className="text-xl font-bold text-green-400 mb-2">Sẵn sàng?</h2>
                )}
                <button 
                    onClick={resetGame}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg active:scale-95 transition-transform"
                >
                    {isGameOver ? 'Chơi lại' : 'Bắt đầu'}
                </button>
            </div>
        )}

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = "";
            if (isSnakeHead) cellClass = "bg-green-400 rounded-sm z-10";
            else if (isSnakeBody) cellClass = "bg-green-600 rounded-sm opacity-80";
            else if (isFood) cellClass = "bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]";

            return <div key={index} className={cellClass}></div>
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 w-48">
          <div></div>
          <button 
            className="w-14 h-14 bg-slate-700 rounded-xl shadow-lg active:bg-slate-600 flex items-center justify-center text-2xl"
            onClick={() => changeDirection('UP')}>⬆️</button>
          <div></div>
          
          <button 
            className="w-14 h-14 bg-slate-700 rounded-xl shadow-lg active:bg-slate-600 flex items-center justify-center text-2xl"
            onClick={() => changeDirection('LEFT')}>⬅️</button>
          <button 
            className="w-14 h-14 bg-slate-700 rounded-xl shadow-lg active:bg-slate-600 flex items-center justify-center text-2xl"
            onClick={() => changeDirection('DOWN')}>⬇️</button>
          <button 
            className="w-14 h-14 bg-slate-700 rounded-xl shadow-lg active:bg-slate-600 flex items-center justify-center text-2xl"
            onClick={() => changeDirection('RIGHT')}>➡️</button>
      </div>
    </div>
  );
};

export default SnakeGame;