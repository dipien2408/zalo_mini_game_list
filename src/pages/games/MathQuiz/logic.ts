import { Question, Answer } from "@/types/mathQuiz";

const getRandomInt = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestion = (): Question => {
  const num1 = getRandomInt(1, 20);
  const num2 = getRandomInt(1, 20);;

  const operators = ['+', '-', '*'];
  const operator = operators[getRandomInt(0, operators.length - 1)];

  let result: number;
  switch (operator) {
    case '+':
      result = num1 + num2; break;
    case '-':
      result = num1 - num2; break;
    case '*':
      result = num1 * num2; break;
    default:
      result = 0;
  }

  const wrongAnswers1 = result + getRandomInt(1,5);
  let wrongAnswers2= result - getRandomInt(1,5);

  if(wrongAnswers1 === wrongAnswers2){ wrongAnswers2 +=1;}

  const answers: Answer[] = [
    { value: result, isCorrect: true },
    { value: wrongAnswers1, isCorrect: false },
    { value: wrongAnswers2, isCorrect: false },
  ].sort(() => Math.random() - 0.5);

  return {
    text: `${num1} ${operator} ${num2} = ?`,
    answers: answers,
  };
}

