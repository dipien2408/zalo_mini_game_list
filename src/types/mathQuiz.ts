export interface Answer {
  value: number;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  answers: Answer[];
}