import { 
  CostExplorerClient, 
  GetCostAndUsageCommand,
  GetCostForecastCommand,
  Dimension,
  Granularity,
} from '@aws-sdk/client-cost-explorer';
import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
  ListMetricsCommand,
  Metric,
} from '@aws-sdk/client-cloudwatch';

// Cost Explorer Client
const costExplorerClient = new CostExplorerClient({
  region: process.env.AWS_REGION || 'us-east-1', // Cost Explorer는 us-east-1에서만 사용 가능
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// CloudWatch Client
const cloudWatchClient = new CloudWatchClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface CostData {
  date: string;
  amount: number;
  unit: string;
  service: string;
}

export interface UsageMetrics {
  timestamp: Date;
  metricName: string;
  value: number;
  unit: string;
}

export interface CostSummary {
  currentMonthCost: number;
  lastMonthCost: number;
  dailyCosts: CostData[];
  forecast: number;
  currency: string;
}

// Rekognition 비용 조회 (일별)
export async function getRekognitionCosts(days: number = 30): Promise<CostData[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startDate.toISOString().split('T')[0],
        End: endDate.toISOString().split('T')[0],
      },
      Granularity: Granularity.DAILY,
      Metrics: ['UnblendedCost'],
      Filter: {
        Dimensions: {
          Key: Dimension.SERVICE,
          Values: ['Amazon Rekognition'],
        },
      },
    });

    const response = await costExplorerClient.send(command);
    
    const costs: CostData[] = response.ResultsByTime?.map((result) => ({
      date: result.TimePeriod?.Start || '',
      amount: parseFloat(result.Total?.UnblendedCost?.Amount || '0'),
      unit: result.Total?.UnblendedCost?.Unit || 'USD',
      service: 'Amazon Rekognition',
    })) || [];

    return costs;
  } catch (error) {
    console.error('Error fetching Rekognition costs:', error);
    throw error;
  }
}

// 월별 비용 요약 조회
export async function getCostSummary(): Promise<CostSummary> {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 현재 월 비용
    const currentMonthCommand = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: currentMonthStart.toISOString().split('T')[0],
        End: now.toISOString().split('T')[0],
      },
      Granularity: Granularity.MONTHLY,
      Metrics: ['UnblendedCost'],
      Filter: {
        Dimensions: {
          Key: Dimension.SERVICE,
          Values: ['Amazon Rekognition'],
        },
      },
    });

    // 지난 월 비용
    const lastMonthCommand = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: lastMonthStart.toISOString().split('T')[0],
        End: lastMonthEnd.toISOString().split('T')[0],
      },
      Granularity: Granularity.MONTHLY,
      Metrics: ['UnblendedCost'],
      Filter: {
        Dimensions: {
          Key: Dimension.SERVICE,
          Values: ['Amazon Rekognition'],
        },
      },
    });

    // 비용 예측
    const forecastCommand = new GetCostForecastCommand({
      TimePeriod: {
        Start: now.toISOString().split('T')[0],
        End: nextMonthStart.toISOString().split('T')[0],
      },
      Metric: 'UNBLENDED_COST',
      Granularity: Granularity.MONTHLY,
      Filter: {
        Dimensions: {
          Key: Dimension.SERVICE,
          Values: ['Amazon Rekognition'],
        },
      },
    });

    const [currentMonthResponse, lastMonthResponse, forecastResponse, dailyCosts] = await Promise.all([
      costExplorerClient.send(currentMonthCommand),
      costExplorerClient.send(lastMonthCommand),
      costExplorerClient.send(forecastCommand).catch(() => null), // 예측이 실패해도 계속 진행
      getRekognitionCosts(30),
    ]);

    const currentMonthCost = parseFloat(
      currentMonthResponse.ResultsByTime?.[0]?.Total?.UnblendedCost?.Amount || '0'
    );
    const lastMonthCost = parseFloat(
      lastMonthResponse.ResultsByTime?.[0]?.Total?.UnblendedCost?.Amount || '0'
    );
    const forecast = parseFloat(
      forecastResponse?.ForecastResultsByTime?.[0]?.MeanValue || '0'
    );

    return {
      currentMonthCost,
      lastMonthCost,
      dailyCosts,
      forecast,
      currency: currentMonthResponse.ResultsByTime?.[0]?.Total?.UnblendedCost?.Unit || 'USD',
    };
  } catch (error) {
    console.error('Error fetching cost summary:', error);
    throw error;
  }
}

// CloudWatch에서 Rekognition 메트릭 조회
export async function getRekognitionMetrics(
  metricName: string = 'SuccessfulAPIRequestCount',
  hours: number = 24
): Promise<UsageMetrics[]> {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    const command = new GetMetricStatisticsCommand({
      Namespace: 'AWS/Rekognition',
      MetricName: metricName,
      Dimensions: [],
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600, // 1시간 단위
      Statistics: ['Sum', 'Average'],
    });

    const response = await cloudWatchClient.send(command);

    const metrics: UsageMetrics[] = response.Datapoints?.map((datapoint) => ({
      timestamp: new Date(datapoint.Timestamp!),
      metricName,
      value: datapoint.Sum || datapoint.Average || 0,
      unit: datapoint.Unit || 'Count',
    })) || [];

    // 시간순 정렬
    metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return metrics;
  } catch (error) {
    console.error('Error fetching Rekognition metrics:', error);
    throw error;
  }
}

// 사용 가능한 모든 Rekognition 메트릭 조회
export async function listRekognitionMetrics(): Promise<Metric[]> {
  try {
    const command = new ListMetricsCommand({
      Namespace: 'AWS/Rekognition',
    });

    const response = await cloudWatchClient.send(command);
    return response.Metrics || [];
  } catch (error) {
    console.error('Error listing Rekognition metrics:', error);
    throw error;
  }
}

// API 호출 횟수 조회 (오늘)
export async function getTodayAPICallCount(): Promise<number> {
  try {
    const metrics = await getRekognitionMetrics('SuccessfulAPIRequestCount', 24);
    return metrics.reduce((sum, metric) => sum + metric.value, 0);
  } catch (error) {
    console.error('Error fetching today API call count:', error);
    return 0;
  }
}

// 실시간 비용 추정 (API 호출당 비용 기준)
export function estimateRealTimeCost(apiCallCount: number): {
  compareFacesCost: number;
  detectFacesCost: number;
  totalEstimatedCost: number;
} {
  // AWS Rekognition 가격 (2024년 기준, USD)
  // CompareFaces: $0.001 per image
  // DetectFaces: $0.001 per image
  const pricePerCompareFaces = 0.001;
  const pricePerDetectFaces = 0.001;

  // 대략적인 비율 가정 (실제 사용 패턴에 따라 조정 필요)
  const compareFacesRatio = 0.6; // 60%가 CompareFaces
  const detectFacesRatio = 0.4; // 40%가 DetectFaces

  const compareFacesCount = Math.floor(apiCallCount * compareFacesRatio);
  const detectFacesCount = Math.floor(apiCallCount * detectFacesRatio);

  const compareFacesCost = compareFacesCount * pricePerCompareFaces;
  const detectFacesCost = detectFacesCount * pricePerDetectFaces;
  const totalEstimatedCost = compareFacesCost + detectFacesCost;

  return {
    compareFacesCost,
    detectFacesCost,
    totalEstimatedCost,
  };
}