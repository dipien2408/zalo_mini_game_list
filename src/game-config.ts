import {GameInfo} from "@/types";
import MathQuizGame from "@/pages/games/MathQuiz";
import SnakeGame from "@/pages/games/Snake";
import LuckyWheelGame from "@/pages/games/LuckyWheel";

export const GAME_LIST: GameInfo[] = [
  {
    id: "math-quiz",
    name: "Đố vui toán học",
    description: "Thử thách tính nhẩm!",
    icon: "🧮",
    component: MathQuizGame,
    color: 'bg-blue-100 text-blue-600'
  },

  {
    id: "snake",
    name: "Rắn săn mồi",
    description: "Ăn càng nhiều càng tốt!",
    icon: "🐍",
    component: SnakeGame,
    color: 'bg-green-100 text-green-600'
  },

  {
    id: "lucky-wheel",
    name: "Vòng quay may mắn",
    description: "Cơ hội trở thành tỷ phú, sao lại không thử!",
    icon: "🎡",
    component: LuckyWheelGame,
    color: 'bg-purple-100 text-purple-600'
  }
  //future games here
  //...
  //here
];
