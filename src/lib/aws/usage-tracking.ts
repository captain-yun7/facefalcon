// 로컬 사용량 추적 (Cost Explorer 대체)
interface UsageRecord {
  timestamp: Date;
  operation: 'compareFaces' | 'detectFaces';
  count: number;
}

class UsageTracker {
  private static instance: UsageTracker;
  private usage: UsageRecord[] = [];
  private readonly STORAGE_KEY = 'rekognition_usage';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.usage = parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          this.cleanOldRecords();
        } catch (e) {
          console.error('Failed to load usage data:', e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usage));
    }
  }

  private cleanOldRecords() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.usage = this.usage.filter(record => record.timestamp > thirtyDaysAgo);
  }

  trackUsage(operation: 'compareFaces' | 'detectFaces') {
    this.usage.push({
      timestamp: new Date(),
      operation,
      count: 1,
    });
    this.cleanOldRecords();
    this.saveToStorage();
  }

  getUsageSummary(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filtered = this.usage.filter(record => record.timestamp > startDate);
    
    const summary = {
      totalCalls: filtered.length,
      compareFaces: filtered.filter(r => r.operation === 'compareFaces').length,
      detectFaces: filtered.filter(r => r.operation === 'detectFaces').length,
      dailyUsage: this.getDailyUsage(filtered),
      estimatedCost: this.calculateEstimatedCost(filtered),
    };

    return summary;
  }

  private getDailyUsage(records: UsageRecord[]) {
    const daily = new Map<string, { compareFaces: number; detectFaces: number; total: number }>();

    records.forEach(record => {
      const dateKey = record.timestamp.toISOString().split('T')[0];
      if (!daily.has(dateKey)) {
        daily.set(dateKey, { compareFaces: 0, detectFaces: 0, total: 0 });
      }
      const day = daily.get(dateKey)!;
      day.total++;
      if (record.operation === 'compareFaces') {
        day.compareFaces++;
      } else {
        day.detectFaces++;
      }
    });

    return Array.from(daily.entries())
      .map(([date, usage]) => ({ date, ...usage }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateEstimatedCost(records: UsageRecord[]) {
    // AWS Rekognition 가격 (USD)
    const PRICE_PER_1000 = 1.00; // $1 per 1000 images
    const pricePerCall = PRICE_PER_1000 / 1000;

    const compareFacesCalls = records.filter(r => r.operation === 'compareFaces').length;
    const detectFacesCalls = records.filter(r => r.operation === 'detectFaces').length;

    return {
      compareFaces: compareFacesCalls * pricePerCall,
      detectFaces: detectFacesCalls * pricePerCall,
      total: (compareFacesCalls + detectFacesCalls) * pricePerCall,
      currency: 'USD',
    };
  }

  getTodayUsage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = this.usage.filter(record => record.timestamp >= today);
    
    return {
      totalCalls: todayRecords.length,
      compareFaces: todayRecords.filter(r => r.operation === 'compareFaces').length,
      detectFaces: todayRecords.filter(r => r.operation === 'detectFaces').length,
      estimatedCost: this.calculateEstimatedCost(todayRecords),
    };
  }

  getHourlyUsage(hours: number = 24) {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    const filtered = this.usage.filter(record => record.timestamp > startTime);
    const hourly = new Map<string, number>();

    filtered.forEach(record => {
      const hourKey = new Date(record.timestamp).toISOString().slice(0, 13); // YYYY-MM-DDTHH
      hourly.set(hourKey, (hourly.get(hourKey) || 0) + 1);
    });

    return Array.from(hourly.entries())
      .map(([hour, count]) => ({
        timestamp: new Date(hour + ':00:00'),
        count,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const usageTracker = UsageTracker.getInstance();

// 서버사이드용 간단한 비용 추정
export function estimateCostFromAPICall(operation: 'compareFaces' | 'detectFaces'): number {
  const PRICE_PER_1000 = 1.00;
  return PRICE_PER_1000 / 1000;
}