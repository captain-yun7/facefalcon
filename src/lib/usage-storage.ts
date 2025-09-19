import fs from 'fs';
import path from 'path';

interface UsageRecord {
  timestamp: string;
  operation: 'compareFaces' | 'detectFaces';
  metadata?: {
    imageSize?: number;
    similarity?: number;
  };
}

interface DailyUsage {
  date: string;
  compareFaces: number;
  detectFaces: number;
  total: number;
}

class FileUsageStorage {
  private static instance: FileUsageStorage;
  private readonly dataDir: string;
  private readonly dataFile: string;

  private constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.dataFile = path.join(this.dataDir, 'usage-records.json');
    this.ensureDataDir();
  }

  static getInstance(): FileUsageStorage {
    if (!FileUsageStorage.instance) {
      FileUsageStorage.instance = new FileUsageStorage();
    }
    return FileUsageStorage.instance;
  }

  private ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private readRecords(): UsageRecord[] {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading usage records:', error);
      return [];
    }
  }

  private writeRecords(records: UsageRecord[]) {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(records, null, 2));
    } catch (error) {
      console.error('Error writing usage records:', error);
    }
  }

  addRecord(operation: 'compareFaces' | 'detectFaces', metadata?: any) {
    const records = this.readRecords();
    const newRecord: UsageRecord = {
      timestamp: new Date().toISOString(),
      operation,
      metadata,
    };
    
    records.push(newRecord);
    
    // 30일보다 오래된 레코드 제거
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredRecords = records.filter(
      record => new Date(record.timestamp) > thirtyDaysAgo
    );
    
    this.writeRecords(filteredRecords);
    console.log(`[Usage Storage] Added ${operation} record. Total records: ${filteredRecords.length}`);
  }

  getRecords(days: number = 30): UsageRecord[] {
    const records = this.readRecords();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return records.filter(record => new Date(record.timestamp) > startDate);
  }

  getDailyUsage(days: number = 30): DailyUsage[] {
    const records = this.getRecords(days);
    const dailyMap = new Map<string, DailyUsage>();

    // 지난 30일 데이터 초기화
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, {
        date: dateStr,
        compareFaces: 0,
        detectFaces: 0,
        total: 0,
      });
    }

    // 실제 사용량 집계
    records.forEach(record => {
      const dateStr = record.timestamp.split('T')[0];
      const daily = dailyMap.get(dateStr);
      if (daily) {
        daily.total++;
        if (record.operation === 'compareFaces') {
          daily.compareFaces++;
        } else {
          daily.detectFaces++;
        }
      }
    });

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  getHourlyUsage(hours: number = 24): Array<{ timestamp: string; value: number }> {
    const records = this.getRecords(1); // 하루치 데이터
    const hourlyMap = new Map<string, number>();

    // 지난 24시간 초기화
    for (let i = hours - 1; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i, 0, 0, 0);
      const hourKey = hour.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      hourlyMap.set(hourKey, 0);
    }

    // 실제 사용량 집계
    records.forEach(record => {
      const hourKey = record.timestamp.slice(0, 13);
      if (hourlyMap.has(hourKey)) {
        hourlyMap.set(hourKey, (hourlyMap.get(hourKey) || 0) + 1);
      }
    });

    return Array.from(hourlyMap.entries()).map(([hour, count]) => ({
      timestamp: hour + ':00:00.000Z',
      value: count,
    }));
  }

  getTodayUsage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const records = this.getRecords(1);
    const todayRecords = records.filter(
      record => new Date(record.timestamp) >= today
    );

    const compareFaces = todayRecords.filter(r => r.operation === 'compareFaces').length;
    const detectFaces = todayRecords.filter(r => r.operation === 'detectFaces').length;

    return {
      totalCalls: todayRecords.length,
      compareFaces,
      detectFaces,
      estimatedCost: this.calculateCost(todayRecords),
    };
  }

  getUsageSummary(days: number = 30) {
    const records = this.getRecords(days);
    const dailyUsage = this.getDailyUsage(days);
    
    const compareFaces = records.filter(r => r.operation === 'compareFaces').length;
    const detectFaces = records.filter(r => r.operation === 'detectFaces').length;

    return {
      totalCalls: records.length,
      compareFaces,
      detectFaces,
      dailyUsage,
      estimatedCost: this.calculateCost(records),
    };
  }

  private calculateCost(records: UsageRecord[]) {
    const PRICE_PER_1000 = 1.00;
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

  // 통계 정보
  getStats() {
    const records = this.readRecords();
    const oldestRecord = records.length > 0 ? records[0].timestamp : null;
    const newestRecord = records.length > 0 ? records[records.length - 1].timestamp : null;
    
    return {
      totalRecords: records.length,
      oldestRecord,
      newestRecord,
      fileSize: fs.existsSync(this.dataFile) ? fs.statSync(this.dataFile).size : 0,
    };
  }

  // 수동 데이터 추가 (테스트용)
  addTestData(days: number = 7) {
    const records = [];
    
    for (let day = days; day > 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      // 하루에 5-15개 랜덤 API 호출 시뮬레이션
      const callsPerDay = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < callsPerDay; i++) {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        
        date.setHours(randomHour, randomMinute, 0, 0);
        
        const operation = Math.random() > 0.5 ? 'compareFaces' : 'detectFaces';
        
        records.push({
          timestamp: date.toISOString(),
          operation,
          metadata: {
            imageSize: Math.floor(Math.random() * 1000000) + 50000,
          },
        });
      }
    }
    
    const existingRecords = this.readRecords();
    this.writeRecords([...existingRecords, ...records]);
    
    console.log(`Added ${records.length} test records for ${days} days`);
  }
}

export const fileUsageStorage = FileUsageStorage.getInstance();