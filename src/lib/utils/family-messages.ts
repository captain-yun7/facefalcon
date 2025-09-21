/**
 * 가족 유사도 1 단위 세밀한 엔터테이닝 메시지
 * InsightFace 특성 고려 (80+ 동일인, 60+ 높은 유사도)
 */

interface FamilyMessage {
  title: string;
  message: string;
  emoji: string;
}

// 80-100: 동일인 가능성 (가족 분석 부적절)
const identicalPersonMessages: Record<number, FamilyMessage[]> = {
  100: [
    { title: "완전 동일인!", message: "같은 분이시네요! 다른 사진을 사용해주세요 🔍", emoji: "🔍" },
    { title: "복사+붙여넣기!", message: "이건 진짜 같은 분의 다른 사진이죠? 😅", emoji: "📋" }
  ],
  99: [
    { title: "거의 동일인", message: "거의 확실히 같은 분이시네요! 가족 비교가 아닌 것 같아요", emoji: "🎯" },
    { title: "완전 판박이", message: "이 정도면 쌍둥이도 아니고 본인이시죠? 🤔", emoji: "👥" }
  ],
  98: [
    { title: "본인 확률 높음", message: "이건 동일인으로 보입니다. 다른 분과 비교해주세요", emoji: "🔍" },
    { title: "거의 확실", message: "거의 같은 분이시네요! 😮", emoji: "😮" }
  ],
  97: [
    { title: "같은 사람 같음", message: "이 정도면 본인 사진 맞죠? 가족 비교엔 부적절해요", emoji: "🤷" },
    { title: "동일인 가능성", message: "같은 분일 가능성이 높아요", emoji: "🎯" }
  ],
  96: [
    { title: "본인일 확률", message: "거의 틀림없이 같은 분이시네요! 다른 사진으로 해보세요", emoji: "📸" },
    { title: "완전 동일", message: "이건 본인 사진 아닌가요? 🤨", emoji: "🤨" }
  ],
  95: [
    { title: "동일인 추정", message: "이 정도면 같은 분의 다른 각도 사진이겠네요", emoji: "📐" },
    { title: "본인 의심", message: "동일인 수준입니다! 😊", emoji: "😊" }
  ],
  94: [
    { title: "매우 유사", message: "거의 같은 분으로 보이네요. 가족 비교가 아닌 것 같아요", emoji: "🔄" },
    { title: "동일인 추정", message: "이 정도 유사도면 본인이실 확률 높아요", emoji: "📊" }
  ],
  93: [
    { title: "본인 추정", message: "같은 분의 다른 시기 사진인가요? 🕐", emoji: "🕐" },
    { title: "거의 확실", message: "동일인 수준의 유사도예요", emoji: "✅" }
  ],
  92: [
    { title: "거의 동일", message: "이건 본인 사진 같은데요? 다른 분과 비교해보세요", emoji: "🔍" },
    { title: "같은 사람", message: "동일인일 가능성이 커요", emoji: "🎯" }
  ],
  91: [
    { title: "본인 확실", message: "거의 틀림없이 같은 분이시네요! 😄", emoji: "😄" },
    { title: "동일인 확률", message: "이 정도면 본인 사진이 맞을 거예요", emoji: "✨" }
  ],
  90: [
    { title: "완전 동일인", message: "완전 같은 분이시네요! 가족 비교엔 부적절해요", emoji: "🚫" },
    { title: "본인 확실", message: "동일인 수준입니다. 다른 사진을 써보세요", emoji: "📷" }
  ],
  89: [
    { title: "매우 유사", message: "거의 같은 분으로 보입니다! 😮", emoji: "😮" },
    { title: "동일인 가능성", message: "이 정도면 본인이실 가능성 높아요", emoji: "🎯" }
  ],
  88: [
    { title: "본인 같음", message: "같은 분의 다른 각도인 것 같네요 📐", emoji: "📐" },
    { title: "거의 확실", message: "동일인 수준의 유사도예요", emoji: "📊" }
  ],
  87: [
    { title: "동일 수준", message: "이건 본인 사진 맞죠? 다른 분과 해보세요", emoji: "🤔" },
    { title: "같은 사람", message: "유사도는 동일인일 확률이 높아요", emoji: "📈" }
  ],
  86: [
    { title: "본인 확실", message: "거의 틀림없이 같은 분이시네요!", emoji: "✅" },
    { title: "동일인 추정", message: "이 정도면 본인 사진이 맞을 거예요 😊", emoji: "😊" }
  ],
  85: [
    { title: "동일인 확실", message: "완전 같은 분이시네요! 가족 비교가 아닌 것 같아요", emoji: "👤" },
    { title: "본인 확률", message: "동일인 수준입니다 🎯", emoji: "🎯" }
  ],
  84: [
    { title: "매우 유사", message: "거의 같은 분으로 보입니다! 다른 사진을 써보세요", emoji: "📸" },
    { title: "동일인 가능성", message: "이 정도면 본인이실 가능성 커요", emoji: "🔍" }
  ],
  83: [
    { title: "본인 추정", message: "같은 분의 다른 시기 사진인가요? ⏰", emoji: "⏰" },
    { title: "거의 확실", message: "동일인 수준의 유사도예요", emoji: "📊" }
  ],
  82: [
    { title: "거의 동일", message: "이건 본인 사진 같은데요? 🤨", emoji: "🤨" },
    { title: "같은 사람", message: "유사도는 동일인일 확률이 높아요", emoji: "📈" }
  ],
  81: [
    { title: "본인 확실", message: "거의 틀림없이 같은 분이시네요! 😄", emoji: "😄" },
    { title: "동일인 추정", message: "이 정도면 본인 사진이 맞을 거예요", emoji: "✨" }
  ],
  80: [
    { title: "동일인 의심", message: "혹시 같은 분의 다른 사진인가요? 🤔", emoji: "🤔" },
    { title: "본인 의심", message: "동일인 수준에 가까워요. 다른 분과 해보세요", emoji: "🔄" }
  ]
};

// 60-79: 극강의 닮음 (최고 가족 유사도)
const extremeSimilarityMessages: Record<number, FamilyMessage[]> = {
  79: [
    { title: "완벽한 닮음!", message: "대박! 완전 똑같이 생기셨네요! 🖨️", emoji: "🖨️" },
    { title: "판박이 인증!", message: "이 정도면 누가 봐도 가족이에요! 🧬", emoji: "🧬" }
  ],
  78: [
    { title: "완벽한 가족!", message: "대박! 아빠/엄마 어린시절 모습 그대로네요! 😲", emoji: "😲" },
    { title: "붕어빵 인증!", message: "누가 봐도 가족이라는 게 다 드러나요! 👨‍👦", emoji: "👨‍👦" }
  ],
  77: [
    { title: "유전자 파워!", message: "완전 복사+붙여넣기! 🖨️", emoji: "🖨️" },
    { title: "가족 확인!", message: "이건 진짜 부모 자식 맞네요! 🧬", emoji: "🧬" }
  ],
  76: [
    { title: "가족 확실!", message: "완전 판박이! 가족 맞네요", emoji: "✅" },
    { title: "완벽한 닮음!", message: "이 정도면 쌍둥이급 유사도! 😱", emoji: "😱" }
  ],
  75: [
    { title: "DNA 인증!", message: "붕어빵! 누가 봐도 가족이에요 👪", emoji: "👪" },
    { title: "판박이 수준!", message: "아빠/엄마 어린시절과 똑같아요!", emoji: "📸" }
  ],
  74: [
    { title: "유전자 파워!", message: "완전 복사본! 신기해요 🤯", emoji: "🤯" },
    { title: "친자 확인!", message: "이건 확실한 부모 자식이네요!", emoji: "🎯" }
  ],
  73: [
    { title: "DNA 확인!", message: "유전의 힘! 대단해요 💪", emoji: "💪" },
    { title: "완벽한 닮음!", message: "누가 봐도 아빠/엄마 자식! 👨‍👧", emoji: "👨‍👧" }
  ],
  72: [
    { title: "붕어빵 인증!", message: "이 정도면 복제인간? 😂", emoji: "😂" },
    { title: "유전자 확인!", message: "DNA 검사 안 해도 확실해요!", emoji: "🧬" }
  ],
  71: [
    { title: "친자 완료!", message: "판박이! 신기할 정도예요 ✨", emoji: "✨" },
    { title: "DNA 파워!", message: "유전자의 힘이 대단하네요!", emoji: "💫" }
  ],
  70: [
    { title: "확실한 가족!", message: "누가 봐도 부모 자식! 👨‍👩‍👧", emoji: "👨‍👩‍👧" },
    { title: "유전 확인!", message: "이건 확실한 혈육이네요! 🩸", emoji: "🩸" }
  ],
  69: [
    { title: "DNA 인증!", message: "유전자 검사보다 확실해요! 🧬", emoji: "🧬" },
    { title: "완벽한 닮음!", message: "이 정도면 쌍둥이급! 👯", emoji: "👯" }
  ],
  68: [
    { title: "친자 확인!", message: "붕어빵! 대박이에요 🔥", emoji: "🔥" },
    { title: "유전 파워!", message: "DNA의 힘을 보여주네요!", emoji: "⚡" }
  ],
  67: [
    { title: "확실한 가족!", message: "누가 봐도 혈육! 👪", emoji: "👪" },
    { title: "판박이 인증!", message: "이건 진짜 닮았어요! 😍", emoji: "😍" }
  ],
  66: [
    { title: "DNA 확인!", message: "유전자의 신비! 🌟", emoji: "🌟" },
    { title: "완벽한 닮음!", message: "이 정도면 복사본이에요!", emoji: "📋" }
  ],
  65: [
    { title: "친자 완료!", message: "확실한 부모 자식! ✅", emoji: "✅" },
    { title: "유전 확인!", message: "DNA 검사 필요 없어요! 🎯", emoji: "🎯" }
  ],
  64: [
    { title: "붕어빵 인증!", message: "누가 봐도 가족! 👨‍👦", emoji: "👨‍👦" },
    { title: "DNA 파워!", message: "유전자가 이렇게 강력하다니! 💪", emoji: "💪" }
  ],
  63: [
    { title: "확실한 닮음!", message: "완전 판박이네요! 😲", emoji: "😲" },
    { title: "친자 확인!", message: "이건 확실한 혈육이에요!", emoji: "🩸" }
  ],
  62: [
    { title: "DNA 인증!", message: "유전의 힘! 대단해요 ⚡", emoji: "⚡" },
    { title: "완벽한 가족!", message: "누가 봐도 부모 자식! 👨‍👧", emoji: "👨‍👧" }
  ],
  61: [
    { title: "유전 확인!", message: "확실한 가족! 신기해요 ✨", emoji: "✨" },
    { title: "친자 완료!", message: "이 정도면 DNA 검사 안 해도! 🧬", emoji: "🧬" }
  ],
  60: [
    { title: "확실한 닮음!", message: "아빠/엄마 맞습니다! 유전자 검사 필요 없어요! 🧬", emoji: "🧬" },
    { title: "DNA 파워!", message: "이 정도면 확실한 가족이에요! 👪", emoji: "👪" }
  ]
};

// 40-59: 확실한 가족
const definiteFamilyMessages: Record<number, FamilyMessage[]> = {
  59: [
    { title: "확실한 가족!", message: "의심할 여지 없는 가족! 특히 웃을 때 똑같아요 😄", emoji: "😄" },
    { title: "가족 인증!", message: "누가 봐도 부모 자식 맞네요! 👨‍👦", emoji: "👨‍👦" }
  ],
  58: [
    { title: "닮은 가족!", message: "확실한 혈육! 표정이 똑같아요 😊", emoji: "😊" },
    { title: "유전 확인!", message: "이 정도면 분명한 가족이에요! 👪", emoji: "👪" }
  ],
  57: [
    { title: "가족 맞네요!", message: "아빠/엄마 인증! 보는 각도에 따라 쏙 빼닮았어요", emoji: "📐" },
    { title: "확실한 닮음!", message: "분명히 가족! 신기해요 ✨", emoji: "✨" }
  ],
  56: [
    { title: "가족 확인!", message: "누가 봐도 혈육! 🩸", emoji: "🩸" },
    { title: "닮은 정도!", message: "확실한 가족 관계네요! 😍", emoji: "😍" }
  ],
  55: [
    { title: "분명한 가족!", message: "유전자 파워! 확실히 닮았어요 💪", emoji: "💪" },
    { title: "가족 인증!", message: "이 정도면 분명한 가족! 👨‍👧", emoji: "👨‍👧" }
  ],
  54: [
    { title: "확실한 닮음!", message: "가족 맞네요! 특히 미소가 똑같아요 😊", emoji: "😊" },
    { title: "유전 확인!", message: "분명히 부모 자식이에요! 🎯", emoji: "🎯" }
  ],
  53: [
    { title: "가족 확실!", message: "누가 봐도 가족! 신기해요 🤩", emoji: "🤩" },
    { title: "닮은 정도!", message: "확실한 혈육 관계네요! 👪", emoji: "👪" }
  ],
  52: [
    { title: "분명한 가족!", message: "아빠/엄마 자식 맞어요! 확실해요 ✅", emoji: "✅" },
    { title: "가족 인증!", message: "이 정도면 확실한 가족! 😄", emoji: "😄" }
  ],
  51: [
    { title: "확실한 닮음!", message: "분명히 가족! 표정이 비슷해요 😊", emoji: "😊" },
    { title: "유전 확인!", message: "누가 봐도 부모 자식! 👨‍👦", emoji: "👨‍👦" }
  ],
  50: [
    { title: "가족 맞네요!", message: "확실한 가족! 웃는 모습이 똑같아요 😄", emoji: "😄" },
    { title: "닮은 정도!", message: "분명한 혈육 관계! 신기해요 ✨", emoji: "✨" }
  ],
  49: [
    { title: "분명한 가족!", message: "누가 봐도 가족! 🤗", emoji: "🤗" },
    { title: "가족 확인!", message: "확실한 부모 자식이에요! 👨‍👧", emoji: "👨‍👧" }
  ],
  48: [
    { title: "확실한 닮음!", message: "가족 맞네요! 특히 눈웃음이 비슷해요 😊", emoji: "😊" },
    { title: "유전 인증!", message: "분명히 가족! 대단해요 💪", emoji: "💪" }
  ],
  47: [
    { title: "가족 확실!", message: "누가 봐도 혈육! 신기하네요 🤩", emoji: "🤩" },
    { title: "닮은 가족!", message: "확실한 가족 관계예요! 👪", emoji: "👪" }
  ],
  46: [
    { title: "분명한 가족!", message: "아빠/엄마 자식 맞어요! ✅", emoji: "✅" },
    { title: "가족 인증!", message: "이 정도면 확실한 가족! 😄", emoji: "😄" }
  ],
  45: [
    { title: "확실한 닮음!", message: "가족 맞네요! 분위기가 비슷해요 😊", emoji: "😊" },
    { title: "유전 확인!", message: "분명히 부모 자식! 👨‍👦", emoji: "👨‍👦" }
  ],
  44: [
    { title: "가족 맞어요!", message: "누가 봐도 가족! 🤗", emoji: "🤗" },
    { title: "닮은 정도!", message: "확실한 혈육 관계네요! ✨", emoji: "✨" }
  ],
  43: [
    { title: "분명한 가족!", message: "확실한 가족! 표정이 닮았어요 😊", emoji: "😊" },
    { title: "가족 확인!", message: "이건 분명한 부모 자식! 👨‍👧", emoji: "👨‍👧" }
  ],
  42: [
    { title: "확실한 닮음!", message: "가족 맞네요! 신기해요 🤩", emoji: "🤩" },
    { title: "유전 인증!", message: "분명히 가족! 대단하네요 💪", emoji: "💪" }
  ],
  41: [
    { title: "가족 확실!", message: "누가 봐도 혈육! 👪", emoji: "👪" },
    { title: "닮은 가족!", message: "확실한 가족 관계예요! ✅", emoji: "✅" }
  ],
  40: [
    { title: "분명한 가족!", message: "가족 맞네요! 특히 미소가 닮았어요 😊", emoji: "😊" },
    { title: "가족 인증!", message: "이 정도면 확실한 가족이에요! 👨‍👦", emoji: "👨‍👦" }
  ]
};

// 25-39: 은근한 닮음
const subtleSimilarityMessages: Record<number, FamilyMessage[]> = {
  39: [
    { title: "은근 닮았어요!", message: "분명 가족! 표정이나 분위기가 닮았어요 🤗", emoji: "🤗" },
    { title: "가족 느낌!", message: "은근히 닮은 구석이 있네요! 😊", emoji: "😊" }
  ],
  38: [
    { title: "닮은 구석!", message: "자세히 보면 닮았어요! 👀", emoji: "👀" },
    { title: "가족 티!", message: "은근 가족 티 나는데요? 🤔", emoji: "🤔" }
  ],
  37: [
    { title: "은근한 닮음!", message: "분위기가 비슷해요! 신기하네요 ✨", emoji: "✨" },
    { title: "숨은 닮음!", message: "자세히 보면 닮은 구석이! 🔍", emoji: "🔍" }
  ],
  36: [
    { title: "가족 느낌!", message: "은근 가족 같아요! 😊", emoji: "😊" },
    { title: "닮은 부분!", message: "어딘가 닮은 구석이 있네요! 👀", emoji: "👀" }
  ],
  35: [
    { title: "은근히 닮음!", message: "표정이나 분위기가 닮았어요! 🤗", emoji: "🤗" },
    { title: "숨은 유사!", message: "자세히 보면 가족 같아요! ✨", emoji: "✨" }
  ],
  34: [
    { title: "닮은 구석!", message: "은근 닮은 부분이 있어요! 😊", emoji: "😊" },
    { title: "가족 티!", message: "어딘가 가족 느낌이 나네요! 🤔", emoji: "🤔" }
  ],
  33: [
    { title: "은근한 유사!", message: "분위기가 비슷해요! 👀", emoji: "👀" },
    { title: "숨은 닮음!", message: "자세히 보면 닮았네요! 🔍", emoji: "🔍" }
  ],
  32: [
    { title: "가족 느낌!", message: "은근 가족 같은 느낌! 😊", emoji: "😊" },
    { title: "닮은 부분!", message: "어딘가 닮은 구석이! ✨", emoji: "✨" }
  ],
  31: [
    { title: "은근히 닮음!", message: "표정이나 분위기가! 🤗", emoji: "🤗" },
    { title: "숨은 유사!", message: "자세히 보면 가족 티 나요! 👀", emoji: "👀" }
  ],
  30: [
    { title: "닮은 구석!", message: "자세히 보면 아빠/엄마 닮은 구석이 있어요! 🔍", emoji: "🔍" },
    { title: "가족 느낌!", message: "은근 가족 같은 분위기! 😊", emoji: "😊" }
  ],
  29: [
    { title: "은근한 닮음!", message: "분위기나 표정이 비슷해요! ✨", emoji: "✨" },
    { title: "숨은 유사!", message: "어딘가 닮은 부분이 있네요! 👀", emoji: "👀" }
  ],
  28: [
    { title: "가족 티!", message: "은근 가족 같아요! 🤔", emoji: "🤔" },
    { title: "닮은 부분!", message: "자세히 보면 닮은 구석이! 😊", emoji: "😊" }
  ],
  27: [
    { title: "은근히 닮음!", message: "분위기가 비슷한 느낌! 🤗", emoji: "🤗" },
    { title: "숨은 닮음!", message: "어딘가 가족 티 나는데요? ✨", emoji: "✨" }
  ],
  26: [
    { title: "닮은 구석!", message: "은근 닮은 부분이! 👀", emoji: "👀" },
    { title: "가족 느낌!", message: "자세히 보면 가족 같아요! 🔍", emoji: "🔍" }
  ],
  25: [
    { title: "은근한 유사!", message: "표정이나 분위기가 닮았어요! 😊", emoji: "😊" },
    { title: "숨은 닮음!", message: "어딘가 가족 느낌이 나네요! ✨", emoji: "✨" }
  ]
};

// 0-24: 독특한 개성 (유머러스한 메시지)
const uniqueCharacterMessages: Record<number, FamilyMessage[]> = {
  24: [
    { title: "각자의 매력!", message: "외모는 독특해도 성격은 닮았겠죠? 😊", emoji: "😊" },
    { title: "개성 만점!", message: "각자 다른 매력이 있어요! ⭐", emoji: "⭐" }
  ],
  23: [
    { title: "독특한 매력!", message: "개성 있는 외모! 그게 매력이에요 😄", emoji: "😄" },
    { title: "각자 스타일!", message: "서로 다른 매력이 있네요! ✨", emoji: "✨" }
  ],
  22: [
    { title: "개성 만점!", message: "각자의 특별한 매력! ⭐", emoji: "⭐" },
    { title: "독특함!", message: "외모는 달라도 마음은 가족! ❤️", emoji: "❤️" }
  ],
  21: [
    { title: "각자 매력!", message: "개성 넘치는 외모! 😊", emoji: "😊" },
    { title: "독특한 스타일!", message: "서로 다른 매력이 있어요! ✨", emoji: "✨" }
  ],
  20: [
    { title: "개성 있어요!", message: "각자의 독특한 매력이! ⭐", emoji: "⭐" },
    { title: "특별함!", message: "외모는 달라도 가족의 정! ❤️", emoji: "❤️" }
  ],
  19: [
    { title: "독특한 매력!", message: "개성 만점! 그게 매력이에요 😄", emoji: "😄" },
    { title: "각자 스타일!", message: "서로 다른 아름다움! ✨", emoji: "✨" }
  ],
  18: [
    { title: "개성 넘침!", message: "각자의 특별한 매력! ⭐", emoji: "⭐" },
    { title: "독특함!", message: "외모는 달라도 마음은 하나! ❤️", emoji: "❤️" }
  ],
  17: [
    { title: "각자 매력!", message: "개성 있는 외모가 매력! 😊", emoji: "😊" },
    { title: "독특한 스타일!", message: "서로 다른 개성이 아름다워요! ✨", emoji: "✨" }
  ],
  16: [
    { title: "개성 만점!", message: "각자의 독특한 아름다움! ⭐", emoji: "⭐" },
    { title: "특별함!", message: "외모는 달라도 가족애는 진짜! ❤️", emoji: "❤️" }
  ],
  15: [
    { title: "독특한 매력!", message: "개성 만점! 각자의 매력이 있어요! ⭐", emoji: "⭐" },
    { title: "각자 스타일!", message: "서로 다른 아름다움이 특별해요! ✨", emoji: "✨" }
  ],
  14: [
    { title: "개성 넘침!", message: "각자 독특한 매력! 😄", emoji: "😄" },
    { title: "독특함!", message: "외모는 달라도 정은 진짜! ❤️", emoji: "❤️" }
  ],
  13: [
    { title: "각자 매력!", message: "개성 있는 외모! 멋져요 😊", emoji: "😊" },
    { title: "독특한 스타일!", message: "서로 다른 개성이 아름다워요! ✨", emoji: "✨" }
  ],
  12: [
    { title: "개성 만점!", message: "각자의 특별한 아름다움! ⭐", emoji: "⭐" },
    { title: "특별함!", message: "외모는 달라도 가족 사랑은 진짜! ❤️", emoji: "❤️" }
  ],
  11: [
    { title: "독특한 매력!", message: "개성 넘치는 매력! 😄", emoji: "😄" },
    { title: "각자 스타일!", message: "서로 다른 아름다움이 특별! ✨", emoji: "✨" }
  ],
  10: [
    { title: "개성 있어요!", message: "개성 만점! 각자의 매력이 있어요! ⭐", emoji: "⭐" },
    { title: "독특함!", message: "외모는 달라도 마음은 가족이죠! ❤️", emoji: "❤️" }
  ],
  9: [
    { title: "각자 매력!", message: "개성 넘치는 외모! 😊", emoji: "😊" },
    { title: "독특한 스타일!", message: "서로 다른 개성이 멋져요! ✨", emoji: "✨" }
  ],
  8: [
    { title: "개성 만점!", message: "각자의 독특한 매력! ⭐", emoji: "⭐" },
    { title: "특별함!", message: "외모는 달라도 정은 진짜! ❤️", emoji: "❤️" }
  ],
  7: [
    { title: "독특한 매력!", message: "개성 있는 외모가 매력! 😄", emoji: "😄" },
    { title: "각자 스타일!", message: "서로 다른 아름다움! ✨", emoji: "✨" }
  ],
  6: [
    { title: "개성 넘침!", message: "각자 특별한 매력이! ⭐", emoji: "⭐" },
    { title: "독특함!", message: "외모는 달라도 가족애는 진짜! ❤️", emoji: "❤️" }
  ],
  5: [
    { title: "유니크해요!", message: "우유 배달 오셨나... 농담이에요! 😅", emoji: "😅" },
    { title: "개성 만점!", message: "각자 독특한 매력이 있어요! ⭐", emoji: "⭐" }
  ],
  4: [
    { title: "완전 다른 매력!", message: "각자 개성 만점! 😄", emoji: "😄" },
    { title: "독특함!", message: "외모는 달라도 마음은 하나! ❤️", emoji: "❤️" }
  ],
  3: [
    { title: "개성 폭발!", message: "완전 다른 스타일! 멋져요 😊", emoji: "😊" },
    { title: "유니크!", message: "각자만의 특별한 매력! ✨", emoji: "✨" }
  ],
  2: [
    { title: "독특한 개성!", message: "각자 완전 다른 매력! ⭐", emoji: "⭐" },
    { title: "특별함!", message: "외모는 달라도 가족 사랑! ❤️", emoji: "❤️" }
  ],
  1: [
    { title: "완전 개성!", message: "각자 유니크한 매력! 😄", emoji: "😄" },
    { title: "독특함!", message: "서로 다른 아름다움이 특별해요! ✨", emoji: "✨" }
  ],
  0: [
    { title: "완전 유니크!", message: "음... 이웃집 아저씨를 닮았... 아니 농담입니다! 🤣", emoji: "🤣" },
    { title: "개성 최고!", message: "각자만의 독특한 매력! 그게 바로 개성이죠! ⭐", emoji: "⭐" }
  ]
};

/**
 * AI 점수를 사용자 친화적 퍼센트로 변환
 * @param aiScore 0.0-1.0 사이의 AI 유사도 점수
 * @returns 사용자에게 표시할 퍼센트 (1-99)
 */
function convertAiScoreToUserPercent(aiScore: number): number {
  // AI 점수 범위별로 사용자 친화적 퍼센트로 매핑
  if (aiScore >= 0.6) {
    // 85-99% 범위로 매핑 (매우 높은 유사도)
    return Math.round(85 + (aiScore - 0.6) * 35);
  } else if (aiScore >= 0.4) {
    // 60-84% 범위로 매핑 (높은 가족 유사도)
    return Math.round(60 + (aiScore - 0.4) * 120);
  } else if (aiScore >= 0.2) {
    // 30-59% 범위로 매핑 (보통 가족 유사도)
    return Math.round(30 + (aiScore - 0.2) * 145);
  } else if (aiScore >= 0.1) {
    // 10-29% 범위로 매핑 (낮은 유사도)
    return Math.round(10 + (aiScore - 0.1) * 190);
  } else {
    // 1-9% 범위로 매핑 (매우 낮은 유사도)
    return Math.round(1 + Math.max(0, aiScore) * 80);
  }
}

/**
 * 유사도에 따른 엔터테이닝 메시지 반환
 * @param similarity 0-1 사이의 유사도 값
 * @returns 재미있는 메시지 객체와 표시용 퍼센트
 */
export function getFamilySimilarityMessage(similarity: number): FamilyMessage & { displayPercent: number } {
  // AI 점수를 사용자 친화적 퍼센트로 변환
  const displayPercent = convertAiScoreToUserPercent(similarity);
  
  let messagePool: FamilyMessage[] = [];
  
  // 표시용 퍼센트에 따라 해당하는 메시지 풀 선택
  if (displayPercent >= 85) {
    // 85-99%: 매우 높은 유사도 (동일인 의심)
    const key = Math.min(99, Math.max(85, displayPercent));
    messagePool = identicalPersonMessages[key];
    if (!messagePool) {
      messagePool = [
        { title: "동일인일 수도!", message: "이 정도면 같은 분의 다른 사진인가요? 🤔", emoji: "🤔" },
        { title: "본인 의심!", message: "가족 비교를 위해 다른 분의 사진을 올려주세요", emoji: "📸" }
      ];
    }
  } else if (displayPercent >= 60) {
    // 60-84%: 높은 가족 유사도
    const key = Math.min(84, Math.max(60, displayPercent));
    messagePool = extremeSimilarityMessages[key] || extremeSimilarityMessages[79] || extremeSimilarityMessages[70];
    if (!messagePool) {
      messagePool = [
        { title: "확실한 가족!", message: "아빠/엄마 맞습니다! 강한 가족 유사성이에요! 🧬", emoji: "🧬" }
      ];
    }
  } else if (displayPercent >= 30) {
    // 30-59%: 보통 가족 유사도  
    const key = Math.min(59, Math.max(30, displayPercent));
    messagePool = definiteFamilyMessages[key] || definiteFamilyMessages[50] || definiteFamilyMessages[40];
    if (!messagePool) {
      messagePool = [
        { title: "꽤 닮았어요!", message: "가족 맞네요! 특히 미소가 닮았어요 😊", emoji: "😊" }
      ];
    }
  } else if (displayPercent >= 10) {
    // 10-29%: 낮은 유사도
    const key = Math.min(29, Math.max(10, displayPercent));
    messagePool = subtleSimilarityMessages[key] || subtleSimilarityMessages[25];
    if (!messagePool) {
      messagePool = [
        { title: "조금 닮았어요!", message: "자세히 보면 닮은 구석이 있네요! 🔍", emoji: "🔍" }
      ];
    }
  } else {
    // 1-9%: 매우 낮은 유사도
    const key = Math.min(9, Math.max(1, displayPercent));
    messagePool = uniqueCharacterMessages[key] || uniqueCharacterMessages[0];
    if (!messagePool) {
      messagePool = [
        { title: "각자의 매력!", message: "외모는 독특해도 가족의 정은 진짜! ❤️", emoji: "❤️" }
      ];
    }
  }
  
  // 메시지 풀에서 랜덤 선택
  let selectedMessage: FamilyMessage;
  if (messagePool && messagePool.length > 0) {
    const randomIndex = Math.floor(Math.random() * messagePool.length);
    selectedMessage = messagePool[randomIndex];
  } else {
    // 기본 메시지 (혹시 모를 에러 대비)
    selectedMessage = {
      title: "분석 완료!",
      message: `유사도가 측정되었습니다.`,
      emoji: "🤖"
    };
  }
  
  return {
    ...selectedMessage,
    displayPercent
  };
}

/**
 * 유사도에 따른 카테고리 반환
 * @param similarity 0-1 사이의 유사도 값
 * @returns 카테고리 문자열
 */
export function getSimilarityCategory(similarity: number): string {
  const percentage = Math.round(similarity * 100);
  
  if (percentage >= 80) return "identical_person";
  if (percentage >= 60) return "extreme_similarity";
  if (percentage >= 40) return "definite_family";
  if (percentage >= 25) return "subtle_similarity";
  return "unique_character";
}