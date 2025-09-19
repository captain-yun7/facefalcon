import CostMonitoringDashboard from '@/components/CostMonitoringDashboard';
import UsageDataManager from '@/components/UsageDataManager';
import CostOptimizationGuide from '@/components/CostOptimizationGuide';
import HybridConfigManager from '@/components/HybridConfigManager';

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 space-y-8">
        <HybridConfigManager />
        <CostOptimizationGuide />
        <UsageDataManager />
        <CostMonitoringDashboard />
      </div>
    </div>
  );
}