import { QuizQuestion, QuizCategory, QuizDifficulty } from './types';

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: '중고차 구매 시 반드시 확인해야 하는 서류가 아닌 것은?',
    options: ['자동차등록증', '자동차성능·상태점검기록부', '주민등록등본', '책임보험가입증명서'],
    correctAnswer: 2,
    explanation:
      '주민등록등본은 중고차 구매 시 필수 확인 서류가 아닙니다. 자동차등록증, 성능점검기록부, 보험가입증명서가 핵심 확인 서류입니다.',
    category: QuizCategory.PAPERWORK,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 2,
    question: '다음 중 중고차 성능점검 항목이 아닌 것은?',
    options: ['자동차 주행거리', '배출가스 정도', '타이어 마모상태', '차량 색상'],
    correctAnswer: 3,
    explanation:
      '차량 색상은 성능점검 항목이 아닙니다. 주행거리, 배출가스, 타이어 상태 등이 주요 성능점검 항목입니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 3,
    question: '중고차 구매 시 차량의 사고이력을 확인할 수 있는 가장 좋은 방법은?',
    options: [
      '자동차보험회사 사고이력 조회',
      '판매자에게 직접 물어보기',
      '외관 상태 확인하기',
      '차량 시운전하기',
    ],
    correctAnswer: 0,
    explanation:
      '보험회사의 사고이력 조회가 가장 정확한 방법입니다. 판매자의 구두 확인이나 외관 확인만으로는 정확한 사고이력을 알기 어렵습니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 4,
    question: '다음 중 허위매물을 피하는 가장 효과적인 방법은?',
    options: [
      '차량 가격이 시세보다 저렴한지 확인',
      '현차량 실제 확인 및 성능점검기록부 대조',
      '판매자의 연락처 확인',
      '온라인 리뷰 확인',
    ],
    correctAnswer: 1,
    explanation:
      '실제 차량과 성능점검기록부를 대조 확인하는 것이 가장 확실한 방법입니다. 특히 차대번호를 확인하는 것이 중요합니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 5,
    question: '중고차 구매 계약 시 계약금은 일반적으로 차량가격의 몇 % 정도가 적절한가?',
    options: ['5% 이하', '10~20%', '30~40%', '50% 이상'],
    correctAnswer: 1,
    explanation:
      '일반적으로 차량 가격의 10~20% 정도를 계약금으로 지불하는 것이 적절합니다. 너무 적거나 많은 계약금은 위험할 수 있습니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 6,
    question: '중고차 구매 시 차량의 실제 운행거리를 확인하는 가장 확실한 방법은?',
    options: [
      '계기판 확인',
      '차량정비이력 확인',
      '자동차등록증 확인',
      '한국교통안전공단 주행거리 이력 조회',
    ],
    correctAnswer: 3,
    explanation:
      '한국교통안전공단의 주행거리 이력 조회가 가장 정확합니다. 계기판은 조작될 수 있기 때문에 신뢰하기 어렵습니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 7,
    question: '다음 중 중고차 구매 시 피해야 할 차량은?',
    options: ['5년된 차량', '수입차', '영업용으로 사용된 차량', '디젤 차량'],
    correctAnswer: 2,
    explanation:
      '영업용(택시 등)으로 사용된 차량은 일반적으로 주행거리가 매우 많고 차량 부품의 피로도가 높아 구매를 피하는 것이 좋습니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 8,
    question: '중고차 구매 후 발생할 수 있는 숨은 비용이 아닌 것은?',
    options: ['자동차세', '보험료', '연료비', '취득세'],
    correctAnswer: 2,
    explanation:
      '연료비는 차량 운행에 따른 기본 비용입니다. 자동차세, 보험료, 취득세는 차량 구매 시 반드시 고려해야 할 추가 비용입니다.',
    category: QuizCategory.INSURANCE,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 9,
    question: '중고차 구매 시 가장 좋은 시기는?',
    options: ['새해 초', '여름 휴가철', '연말', '봄철'],
    correctAnswer: 2,
    explanation:
      '연말은 딜러들이 재고 처리를 위해 할인을 많이 하는 시기이며, 새 차 출시로 인한 중고차 가격 하락도 기대할 수 있습니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 10,
    question: '중고차 할부 구매 시 주의해야 할 사항이 아닌 것은?',
    options: ['할부 이자율', '중도상환수수료', '차량 색상', '할부기간'],
    correctAnswer: 2,
    explanation:
      '차량 색상은 할부 구매와 관련이 없습니다. 할부 이자율, 중도상환수수료, 할부기간은 반드시 확인해야 할 중요한 사항입니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 11,
    question: '중고차 구매 시 레몬법은 무슨 법일까요?',
    options: [
      '노란색 차량에 대한 특별 세금 제도',
      '소비자가 구매한 차량에 결함이 있을 경우 교환이나 환불을 보장하는 법률',
      '중고차 판매업자의 영업 면허에 관한 법률',
      '수입차에 대한 특별 관세 제도',
    ],
    correctAnswer: 1,
    explanation:
      '레몬법은 소비자가 구매한 차량에 심각한 결함이 있을 경우 교환이나 환불을 요구할 수 있는 소비자 보호법입니다. 결함이 반복적으로 발생하는 차량을 레몬이라고 부르는 데서 유래했습니다.',
    category: QuizCategory.GENERAL,
    difficulty: QuizDifficulty.HARD,
  },
  {
    id: 12,
    question: '중고차의 주행거리 조작을 확인할 수 있는 징후가 아닌 것은?',
    options: [
      '마모된 페달과 스티어링 휠에 비해 적은 주행거리',
      '정비 기록과 주행거리 불일치',
      '계기판 숫자의 정렬 불균형',
      '차량의 제조년식',
    ],
    correctAnswer: 3,
    explanation:
      '차량의 제조년식 자체는 주행거리 조작의 징후가 아닙니다. 반면, 차량의 마모 상태, 정비 기록의 불일치, 계기판 숫자의 비정상적인 정렬 등은 조작의 가능성을 의심할 수 있는 징후입니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.HARD,
  },
  {
    id: 13,
    question: '중고차 인도 시 반드시 확인해야 할 사항이 아닌 것은?',
    options: [
      '자동차세 완납 여부',
      '자동차 리콜 이력',
      '차량 내부 액세서리 목록',
      '책임보험 가입 여부',
    ],
    correctAnswer: 2,
    explanation:
      '차량 내부 액세서리 목록은 필수 확인 사항이 아니며, 판매자와 구매자 간의 협의 사항입니다. 반면 자동차세 완납, 리콜 이력, 책임보험 가입 여부는 법적 문제가 될 수 있어 반드시 확인해야 합니다.',
    category: QuizCategory.PAPERWORK,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 14,
    question: '중고차 시세 확인에 가장 적합한 방법은?',
    options: [
      '판매자에게 직접 문의',
      '중고차 관련 온라인 커뮤니티',
      '자동차 제조사 웹사이트',
      '국내 공인 중고차 시세 사이트 활용',
    ],
    correctAnswer: 3,
    explanation:
      '국내 공인 중고차 시세 사이트(예: KB차차차, 헤이딜러 등)는 많은 데이터를 바탕으로 객관적인 시세 정보를 제공합니다. 판매자나 커뮤니티는 주관적일 수 있으며, 제조사 웹사이트는 신차 중심의 정보를 제공합니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 15,
    question: '중고차 구매 계약 후 계약을 취소할 경우 발생하는 일반적인 위약금 비율은?',
    options: ['계약금의 10%', '계약금 전액', '차량가격의 10%', '위약금 없음'],
    correctAnswer: 1,
    explanation:
      '일반적으로 중고차 구매 계약 후 구매자의 귀책사유로 계약을 취소할 경우, 계약금 전액을 위약금으로 지불하게 됩니다. 이는 대부분의 중고차 매매 계약서에 명시된 사항입니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 16,
    question: '중고차 구매 시 차량 하부에서 확인해야 할 것으로 적절하지 않은 것은?',
    options: ['차체 프레임의 손상', '부식 여부', '오일 누유', '엔진 실린더 압축'],
    correctAnswer: 3,
    explanation:
      '엔진 실린더 압축은 차량 하부에서 확인할 수 없으며, 전문적인 장비를 통해 측정해야 합니다. 차체 프레임 손상, 부식, 오일 누유는 차량 하부 검사 시 중요한 확인 사항입니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.HARD,
  },
  {
    id: 17,
    question: '중고차 구매 후 발생한 문제에 대한 소비자 보호 방법으로 올바르지 않은 것은?',
    options: [
      '한국소비자원에 피해구제 신청',
      '자동차 제조사에 무상 수리 요청',
      '중고차 매매업체에 시정 요청',
      '관할 법원에 소액사건 심판 청구',
    ],
    correctAnswer: 1,
    explanation:
      '중고차는 일반적으로 제조사의 보증기간이 만료된 경우가 많아, 자동차 제조사에 무상 수리를 요청하는 것은 적절한 보호 방법이 아닙니다. 한국소비자원 피해구제 신청, 중고차 매매업체 시정 요청, 소액사건 심판 청구는 적절한 대응 방법입니다.',
    category: QuizCategory.GENERAL,
    difficulty: QuizDifficulty.HARD,
  },
  {
    id: 18,
    question: '중고차의 자동차세는 어떻게 계산되는가?',
    options: [
      '차량 가격에 따라 계산된다',
      '주행거리에 따라 계산된다',
      '엔진 배기량과 차령에 따라 계산된다',
      '연료 종류에 따라 계산된다',
    ],
    correctAnswer: 2,
    explanation:
      '자동차세는 엔진 배기량과 차령(차량 연식)에 따라 계산됩니다. 배기량이 클수록 세금이 높고, 차령이 오래될수록 세금은 감면됩니다. 차량 가격, 주행거리, 연료 종류는 자동차세 계산에 직접적인 영향을 주지 않습니다.',
    category: QuizCategory.INSURANCE,
    difficulty: QuizDifficulty.HARD,
  },
  {
    id: 19,
    question: '중고차 판매 시 명의이전에 필요한 서류가 아닌 것은?',
    options: ['자동차등록증', '책임보험영수증', '양도증명서', '자동차제작증'],
    correctAnswer: 3,
    explanation:
      '자동차제작증은 신차 등록 시 필요한 서류이며, 중고차 명의이전에는 필요하지 않습니다. 자동차등록증, 책임보험영수증, 양도증명서는 중고차 명의이전에 필요한 기본 서류입니다.',
    category: QuizCategory.PAPERWORK,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 20,
    question: '중고차 구매 후 가장 먼저 해야 할 정비는?',
    options: ['엔진 오일 교체', '타이어 교체', '에어컨 필터 교체', '내비게이션 업데이트'],
    correctAnswer: 0,
    explanation:
      '중고차 구매 후 가장 먼저 해야 할 정비는 엔진 오일 교체입니다. 엔진 오일은 엔진의 원활한 작동을 위한 핵심 요소로, 이전 사용자의 사용 패턴이나 교체 주기를 정확히 알 수 없기 때문에 안전을 위해 우선적으로 교체하는 것이 좋습니다.',
    category: QuizCategory.MAINTENANCE,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 21,
    question: '중고차를 현금으로 구매할 때의 장점이 아닌 것은?',
    options: [
      '할부 이자가 발생하지 않는다',
      '가격 협상에 유리하다',
      '등록세가 면제된다',
      '즉시 소유권 이전이 가능하다',
    ],
    correctAnswer: 2,
    explanation:
      '현금으로 구매하더라도 등록세는 면제되지 않습니다. 등록세는 차량 등록 시 반드시 납부해야 하는 세금으로, 구매 방식과 상관없이 부과됩니다.',
    category: QuizCategory.PURCHASE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 22,
    question: '중고차 보증보험이란 무엇인가?',
    options: [
      '자동차 사고 시 피해를 보상해주는 보험',
      '중고차 구입 후 발생하는 기계적 결함을 보장해주는 보험',
      '자동차 도난 시 보상해주는 보험',
      '자동차 주행거리를 보증해주는 보험',
    ],
    correctAnswer: 1,
    explanation:
      '중고차 보증보험은 구입 후 일정 기간 내에 발생하는 기계적 결함에 대해 수리 비용을 보장해주는 보험입니다. 이는 중고차 구매 시 발생할 수 있는 예상치 못한 수리 비용의 부담을 줄여주는 역할을 합니다.',
    category: QuizCategory.INSURANCE,
    difficulty: QuizDifficulty.MEDIUM,
  },
  {
    id: 23,
    question: '중고차 구매 시 배터리 상태를 간단하게 확인하는 방법은?',
    options: [
      '시동 걸기 전에 헤드라이트를 켜고 밝기 확인하기',
      '배터리 단자에 물을 뿌리기',
      '배터리 제조일자만 확인하기',
      '배터리 외관 색상 확인하기',
    ],
    correctAnswer: 0,
    explanation:
      '시동을 걸기 전에 헤드라이트를 켜고 밝기를 확인하는 것은 배터리의 상태를 간단히 점검하는 방법입니다. 밝기가 어둡거나 깜빡이면 배터리 상태가 좋지 않을 수 있습니다. 시동을 건 후 헤드라이트 밝기가 확연히 밝아지면 배터리 충전 상태나 발전기에 문제가 있을 수 있습니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 24,
    question: '중고차 타이어 상태 점검 시 가장 중요한 항목은?',
    options: ['타이어 크기', '타이어 브랜드', '타이어 생산연도', '타이어 트레드 마모 상태'],
    correctAnswer: 3,
    explanation:
      '타이어 트레드(홈)의 마모 상태는 타이어 상태 점검 시 가장 중요한 항목입니다. 트레드 깊이가 법적 기준(1.6mm) 이하로 마모되면 위험하며, 젖은 노면에서 미끄러질 위험이 높아집니다. 크기, 브랜드, 생산연도도 중요하지만 안전과 직결되는 것은 마모 상태입니다.',
    category: QuizCategory.INSPECTION,
    difficulty: QuizDifficulty.EASY,
  },
  {
    id: 25,
    question: '중고차 냉각수 상태 점검 시 주의해야 할 것이 아닌 것은?',
    options: [
      '엔진이 뜨거울 때 라디에이터 캡 열기',
      '냉각수 색상 확인하기',
      '냉각수 양 확인하기',
      '냉각수 순환 상태 확인하기',
    ],
    correctAnswer: 0,
    explanation:
      '엔진이 뜨거울 때 라디에이터 캡을 열면 매우 위험합니다. 고온, 고압 상태의 냉각수가 분출되어 화상을 입을 수 있습니다. 냉각수 점검은 엔진이 완전히 식은 상태에서 해야 합니다.',
    category: QuizCategory.MAINTENANCE,
    difficulty: QuizDifficulty.MEDIUM,
  },
];

export default quizData;
