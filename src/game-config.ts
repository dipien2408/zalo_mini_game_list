import {GameInfo} from "@/types";
import MathQuizGame from "@/pages/games/MathQuiz";

export const GAME_LIST: GameInfo[] = [
  {
    id: "math-quiz",
    name: "Đố vui toán học",
    description: "Thử thách tính nhẩm!",
    icon: "🧮",
    component: MathQuizGame,
    color: 'bg-blue-100 text-blue-600'
  },
  //future games here
  //...
  //here
];
