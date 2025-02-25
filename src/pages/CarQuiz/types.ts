export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
}

export enum QuizCategory {
  PURCHASE = '구매 팁',
  INSPECTION = '점검 사항',
  PAPERWORK = '서류 확인',
  NEGOTIATION = '가격 협상',
  MAINTENANCE = '유지 관리',
  INSURANCE = '보험 및 세금',
  GENERAL = '일반 상식',
}

export enum QuizDifficulty {
  EASY = '초급',
  MEDIUM = '중급',
  HARD = '고급',
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeTaken: number;
  difficulty: QuizDifficulty;
  categoryScores: {
    [key in QuizCategory]?: {
      total: number;
      correct: number;
      percentage: number;
    };
  };
}
