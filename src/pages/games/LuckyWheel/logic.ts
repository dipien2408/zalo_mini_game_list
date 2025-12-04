import { PRIZES, Prize } from "./constants";
export const spinWheel = () : { selectedPrize: Prize, index: number } => {
  const random = Math.random() * 100;
  let currentSum = 0;

  for(let i = 0; i < PRIZES.length; i++) {
    currentSum += PRIZES[i].probability;
    if(random <= currentSum) {
      return { selectedPrize: PRIZES[i], index: i };
    }
  }

  return { selectedPrize: PRIZES[0], index: 0  };
};