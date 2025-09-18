import { SimilarityResult } from '@/lib/types';

export function calculateAverageScore(similarities: number[]): number {
  if (similarities.length === 0) return 0;
  return similarities.reduce((sum, score) => sum + score, 0) / similarities.length;
}

export function getSimilarityLevel(similarity: number): {
  level: string;
  description: string;
  color: string;
} {
  if (similarity >= 90) {
    return {
      level: '매우 높음',
      description: '거의 동일한 얼굴입니다!',
      color: 'text-green-600',
    };
  } else if (similarity >= 80) {
    return {
      level: '높음',
      description: '매우 유사한 얼굴입니다.',
      color: 'text-blue-600',
    };
  } else if (similarity >= 60) {
    return {
      level: '보통',
      description: '어느 정도 닮은 얼굴입니다.',
      color: 'text-yellow-600',
    };
  } else if (similarity >= 40) {
    return {
      level: '낮음',
      description: '약간 닮은 부분이 있습니다.',
      color: 'text-orange-600',
    };
  } else {
    return {
      level: '매우 낮음',
      description: '다른 얼굴입니다.',
      color: 'text-red-600',
    };
  }
}

export function findBestMatch(results: SimilarityResult[]): SimilarityResult | null {
  if (results.length === 0) return null;
  
  return results.reduce((best, current) => 
    current.similarity > best.similarity ? current : best
  );
}

export function rankResults(results: SimilarityResult[]): SimilarityResult[] {
  return [...results].sort((a, b) => b.similarity - a.similarity);
}

export function calculateFamilyResemblance(
  childParent1: number,
  childParent2: number
): {
  moreResembledParent: 'parent1' | 'parent2' | 'equal';
  difference: number;
  percentage: {
    parent1: number;
    parent2: number;
  };
} {
  const total = childParent1 + childParent2;
  const parent1Percentage = total > 0 ? (childParent1 / total) * 100 : 50;
  const parent2Percentage = total > 0 ? (childParent2 / total) * 100 : 50;
  
  const difference = Math.abs(childParent1 - childParent2);
  
  let moreResembledParent: 'parent1' | 'parent2' | 'equal';
  if (difference < 5) {
    moreResembledParent = 'equal';
  } else if (childParent1 > childParent2) {
    moreResembledParent = 'parent1';
  } else {
    moreResembledParent = 'parent2';
  }

  return {
    moreResembledParent,
    difference,
    percentage: {
      parent1: parent1Percentage,
      parent2: parent2Percentage,
    },
  };
}

export function generateInsightMessage(similarity: number, context: string): string {
  const level = getSimilarityLevel(similarity);
  
  switch (context) {
    case 'parent-child':
      if (similarity >= 80) {
        return '부모님의 유전자가 강하게 전달되었네요! 🧬';
      } else if (similarity >= 60) {
        return '분명한 가족의 유사점이 보입니다! 👨‍👩‍👧‍👦';
      } else if (similarity >= 40) {
        return '미묘한 가족 유사점이 있어요. 👀';
      } else {
        return '독특한 개성을 가지고 있네요! ✨';
      }
    
    case 'sibling':
      if (similarity >= 80) {
        return '형제자매가 확실해 보입니다! 👫';
      } else if (similarity >= 60) {
        return '가족임을 알 수 있는 유사점들이 있어요! 🤝';
      } else {
        return '각자의 개성이 뚜렷하네요! 🌟';
      }
    
    default:
      return level.description;
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}