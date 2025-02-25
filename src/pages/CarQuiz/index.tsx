// src/pages/CarQuiz/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BiCheck,
  BiX,
  BiChevronRight,
  BiTimer,
  BiMedal,
  BiAward,
  BiRefresh,
  BiFilter,
  BiHelpCircle,
} from 'react-icons/bi';
import { QuizQuestion, QuizCategory, QuizDifficulty, QuizResult } from './types';
import quizData from './quizData';

const CarQuiz = () => {
  const navigate = useNavigate();

  // 퀴즈 상태 관리
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // 퀴즈 설정
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | 'ALL'>('ALL');

  // 결과 관련
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // 타이머 관련
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // 설정/소개 화면 관련
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // 사용자의 답변 저장 배열
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  // 타이머 시작 함수
  const startTimer = useCallback(() => {
    const now = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    setTimerInterval(interval);
    return interval;
  }, []);

  // 타이머 정지 함수
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // 퀴즈 시작 함수
  const startQuiz = useCallback(() => {
    // 필터링된 문제 목록 생성
    let filteredQuestions = [...quizData];

    if (selectedDifficulty !== 'ALL') {
      filteredQuestions = filteredQuestions.filter((q) => q.difficulty === selectedDifficulty);
    }

    // 충분한 문제가 없는 경우 처리
    if (filteredQuestions.length < questionCount) {
      alert(
        `선택한 필터로는 충분한 문제가 없습니다. 총 ${filteredQuestions.length}개의 문제로 퀴즈를 시작합니다.`
      );
      setQuestionCount(filteredQuestions.length);
    }

    // 문제 셔플 및 선택
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, filteredQuestions.length));

    // 상태 초기화
    setCurrentQuestions(selected);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setShowIntro(false);
    setShowSettings(false);
    setShowResult(false);
    setQuizAnswers([]);
    setElapsedTime(0);

    // 타이머 시작
    startTimer();
  }, [questionCount, selectedDifficulty, startTimer]);

  // 결과 계산 함수
  const calculateResults = useCallback(() => {
    stopTimer();

    // 카테고리별 점수 계산
    const categoryScores: QuizResult['categoryScores'] = {};

    currentQuestions.forEach((question, index) => {
      const isCorrect = quizAnswers[index] === question.correctAnswer;

      // 카테고리 결과 초기화
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = {
          total: 0,
          correct: 0,
          percentage: 0,
        };
      }

      // 카테고리 결과 업데이트
      categoryScores[question.category]!.total += 1;
      if (isCorrect) {
        categoryScores[question.category]!.correct += 1;
      }
    });

    // 카테고리별 백분율 계산
    Object.keys(categoryScores).forEach((category) => {
      const cat = category as QuizCategory;
      if (categoryScores[cat]!.total > 0) {
        categoryScores[cat]!.percentage = Math.round(
          (categoryScores[cat]!.correct / categoryScores[cat]!.total) * 100
        );
      }
    });

    // 최종 결과 객체 생성
    const result: QuizResult = {
      totalQuestions: currentQuestions.length,
      correctAnswers: correctAnswers,
      wrongAnswers: currentQuestions.length - correctAnswers,
      score: Math.round((correctAnswers / currentQuestions.length) * 100),
      timeTaken: elapsedTime,
      difficulty: selectedDifficulty === 'ALL' ? QuizDifficulty.MEDIUM : selectedDifficulty,
      categoryScores: categoryScores,
    };

    setQuizResult(result);
    setShowResult(true);
  }, [currentQuestions, correctAnswers, elapsedTime, selectedDifficulty, stopTimer, quizAnswers]);

  // 문제 답변 선택 처리 함수
  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  // 답변 제출 처리 함수
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    // 사용자의 답변 저장
    const updatedAnswers = [...quizAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setQuizAnswers(updatedAnswers);

    // 정답 체크
    if (selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  // 다음 문제로 이동 처리 함수
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswerSubmitted(false);
    } else {
      calculateResults();
    }
  };

  // 퀴즈 재시작 함수
  const restartQuiz = () => {
    setShowIntro(true);
    setQuizAnswers([]);
    stopTimer();
  };

  // 결과 메시지 생성 함수
  const getResultMessage = () => {
    const score = quizResult?.score || 0;

    if (score === 100) {
      return '축하합니다! 당신은 중고차 전문가입니다!';
    } else if (score >= 80) {
      return '훌륭합니다! 중고차에 대한 지식이 매우 뛰어납니다.';
    } else if (score >= 60) {
      return '좋은 성적입니다. 중고차에 대해 잘 알고 있지만 아직 배울 점이 있습니다.';
    } else if (score >= 40) {
      return '중고차에 대한 기본적인 지식이 있습니다. 조금 더 공부해보세요!';
    } else {
      return '중고차에 대해 더 많이 배울 필요가 있습니다. 실전에서 어려움을 겪지 않도록 공부하세요!';
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // 설정화면 렌더링
  if (showSettings) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-2xl font-bold mb-6 text-center'>퀴즈 설정</h2>

          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>문제 수</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value={5}>5문제</option>
                <option value={10}>10문제</option>
                <option value={15}>15문제</option>
                <option value={20}>20문제</option>
                <option value={25}>모든 문제</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>난이도</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as QuizDifficulty | 'ALL')}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value='ALL'>모든 난이도</option>
                <option value={QuizDifficulty.EASY}>초급</option>
                <option value={QuizDifficulty.MEDIUM}>중급</option>
                <option value={QuizDifficulty.HARD}>고급</option>
              </select>
            </div>
          </div>

          <div className='mt-8 flex space-x-4 justify-center'>
            <button
              onClick={() => setShowSettings(false)}
              className='px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors'
            >
              취소
            </button>
            <button
              onClick={startQuiz}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            >
              퀴즈 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 인트로 화면 렌더링
  if (showIntro) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
          <h1 className='text-3xl font-bold mb-6'>중고차 전문가 테스트</h1>

          <div className='mb-8'>
            <p className='text-lg text-gray-700 mb-4'>
              중고차 구매와 관련된 다양한 지식을 테스트하고 당신의 중고차 전문가 레벨을
              확인해보세요!
            </p>
            <p className='text-gray-600'>
              다양한 주제의 문제를 통해 중고차 구매 시 필요한 핵심 지식을 점검할 수 있습니다.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <div className='bg-blue-50 rounded-lg p-6'>
              <BiMedal className='w-10 h-10 text-blue-500 mx-auto mb-2' />
              <h3 className='font-bold mb-2'>여러 난이도</h3>
              <p className='text-sm text-gray-600'>
                초급부터 고급까지 다양한 난이도의 문제로 구성되어 있습니다.
              </p>
            </div>
            <div className='bg-blue-50 rounded-lg p-6'>
              <BiAward className='w-10 h-10 text-blue-500 mx-auto mb-2' />
              <h3 className='font-bold mb-2'>상세한 결과 분석</h3>
              <p className='text-sm text-gray-600'>
                카테고리별 점수와 상세한 분석을 통해 자신의 강점과 약점을 알 수 있습니다.
              </p>
            </div>
            <div className='bg-blue-50 rounded-lg p-6'>
              <BiHelpCircle className='w-10 h-10 text-blue-500 mx-auto mb-2' />
              <h3 className='font-bold mb-2'>실전 지식</h3>
              <p className='text-sm text-gray-600'>
                실제 중고차 구매 과정에서 필요한 실용적인 지식을 테스트합니다.
              </p>
            </div>
          </div>

          <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center'>
            <button
              onClick={() => setShowSettings(true)}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            >
              <BiFilter className='inline-block mr-2' />
              퀴즈 설정하기
            </button>
            <button
              onClick={startQuiz}
              className='px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors'
            >
              <BiChevronRight className='inline-block mr-2' />
              바로 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면 렌더링
  if (showResult && quizResult) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-2xl font-bold mb-2 text-center'>퀴즈 결과</h2>
          <p className='text-center text-gray-600 mb-6'>{formatTime(quizResult.timeTaken)} 소요</p>

          <div className='flex flex-col items-center mb-8'>
            <div
              className={`w-40 h-40 rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold
              ${
                quizResult.score >= 80
                  ? 'bg-green-500'
                  : quizResult.score >= 60
                    ? 'bg-blue-500'
                    : quizResult.score >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
              }`}
            >
              {quizResult.score}%
            </div>
            <p className='text-xl font-medium'>{getResultMessage()}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-bold mb-4 text-lg'>통계</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>총 문제</span>
                  <span className='font-medium'>{quizResult.totalQuestions}문제</span>
                </div>
                <div className='flex justify-between'>
                  <span>맞은 문제</span>
                  <span className='font-medium text-green-600'>
                    {quizResult.correctAnswers}문제
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>틀린 문제</span>
                  <span className='font-medium text-red-600'>{quizResult.wrongAnswers}문제</span>
                </div>
                <div className='flex justify-between'>
                  <span>정답률</span>
                  <span className='font-medium'>{quizResult.score}%</span>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 p-6 rounded-lg'>
              <h3 className='font-bold mb-4 text-lg'>카테고리별 성적</h3>
              <div className='space-y-3'>
                {Object.entries(quizResult.categoryScores).map(([category, data]) => (
                  <div key={category}>
                    <div className='flex justify-between text-sm mb-1'>
                      <span>{category}</span>
                      <span>
                        {data.correct}/{data.total} ({data.percentage}%)
                      </span>
                    </div>
                    <div className='w-full bg-gray-300 h-2 rounded-full'>
                      <div
                        className='h-2 bg-blue-600 rounded-full'
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex justify-center space-x-4'>
            <button
              onClick={restartQuiz}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            >
              <BiRefresh className='inline-block mr-2' />
              다시 시작하기
            </button>
            <button
              onClick={() => navigate('/')}
              className='px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors'
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 문제가 없는 경우 처리
  if (!currentQuestions.length) {
    return <div className='flex justify-center items-center min-h-screen'>로딩중...</div>;
  }

  // 현재 문제
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // 퀴즈 화면 렌더링
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-xl shadow-lg p-8'>
        {/* 헤더 정보 */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <span className='text-sm font-medium text-gray-500 mr-2'>난이도:</span>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full
              ${
                currentQuestion.difficulty === QuizDifficulty.EASY
                  ? 'bg-green-100 text-green-800'
                  : currentQuestion.difficulty === QuizDifficulty.MEDIUM
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className='flex items-center'>
            <BiTimer className='w-5 h-5 text-gray-500 mr-1' />
            <span className='text-sm font-medium'>{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* 진행 상태 */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium'>
              문제 {currentQuestionIndex + 1} / {currentQuestions.length}
            </span>
            <span className='text-sm font-medium text-gray-500'>
              카테고리: {currentQuestion.category}
            </span>
          </div>
          <div className='w-full h-2 bg-gray-200 rounded-full'>
            <div
              className='h-2 bg-blue-600 rounded-full transition-all duration-300'
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 문제 내용 */}
        <h3 className='text-xl font-bold mb-6'>{currentQuestion.question}</h3>

        {/* 선택지 목록 */}
        <div className='space-y-4 mb-8'>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswerSubmitted}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? isAnswerSubmitted
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-blue-50 border-blue-500'
                  : isAnswerSubmitted && index === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0'>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className='flex-grow'>{option}</span>
                {isAnswerSubmitted &&
                  (index === currentQuestion.correctAnswer ? (
                    <BiCheck className='text-green-500 w-6 h-6' />
                  ) : selectedAnswer === index ? (
                    <BiX className='text-red-500 w-6 h-6' />
                  ) : null)}
              </div>
            </button>
          ))}
        </div>

        {/* 문제 설명 */}
        {showExplanation && (
          <div className='mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <h4 className='font-medium mb-2'>설명:</h4>
            <p className='text-gray-700'>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className='flex justify-end space-x-4'>
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarQuiz;
