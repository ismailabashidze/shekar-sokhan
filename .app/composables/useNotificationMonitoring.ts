export interface SystemMetrics {
  id?: string;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  database_response_time: number;
  notification_delivery_rate: number;
  error_count: number;
  active_users: number;
  created?: string;
}

export interface SystemAlert {
  id?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  category: string;
  component?: string;
  details?: Record<string, any>;
  acknowledged: boolean;
  auto_resolved: boolean;
  resolved_at?: string;
  created?: string;
  updated?: string;
}

export function useNotificationMonitoring() {
  const { $pb } = useNuxtApp();

  const getMetrics = async (limit: number = 50): Promise<SystemMetrics[]> => {
    try {
      const result = await $pb.collection('system_metrics').getList(1, limit, {
        sort: '-created',
      });
      return result.items as SystemMetrics[];
    }
    catch (error) {
      console.error('Failed to get metrics:', error);
      return [];
    }
  };

  const getCurrentMetrics = async (): Promise<SystemMetrics | null> => {
    try {
      const result = await $pb.collection('system_metrics').getList(1, 1, {
        sort: '-created',
      });
      return result.items[0] as SystemMetrics || null;
    }
    catch (error) {
      console.error('Failed to get current metrics:', error);
      return null;
    }
  };

  const createMetrics = async (metrics: Partial<SystemMetrics>): Promise<SystemMetrics | null> => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        ...metrics,
      };
      const result = await $pb.collection('system_metrics').create(data);
      return result as SystemMetrics;
    }
    catch (error) {
      console.error('Failed to create metrics:', error);
      return null;
    }
  };

  const getAlerts = async (filter?: string): Promise<SystemAlert[]> => {
    try {
      const result = await $pb.collection('system_alerts').getList(1, 100, {
        filter: filter || '',
        sort: '-created',
      });
      return result.items as SystemAlert[];
    }
    catch (error) {
      console.error('Failed to get alerts:', error);
      return [];
    }
  };

  const createAlert = async (alert: Partial<SystemAlert>): Promise<SystemAlert | null> => {
    try {
      const data = {
        acknowledged: false,
        auto_resolved: false,
        ...alert,
      };
      const result = await $pb.collection('system_alerts').create(data);
      return result as SystemAlert;
    }
    catch (error) {
      console.error('Failed to create alert:', error);
      return null;
    }
  };

  const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
    try {
      await $pb.collection('system_alerts').update(alertId, {
        acknowledged: true,
      });
      return true;
    }
    catch (error) {
      console.error('Failed to acknowledge alert:', error);
      return false;
    }
  };

  const resolveAlert = async (alertId: string): Promise<boolean> => {
    try {
      await $pb.collection('system_alerts').update(alertId, {
        resolved_at: new Date().toISOString(),
      });
      return true;
    }
    catch (error) {
      console.error('Failed to resolve alert:', error);
      return false;
    }
  };

  return {
    getMetrics,
    getCurrentMetrics,
    createMetrics,
    getAlerts,
    createAlert,
    acknowledgeAlert,
    resolveAlert,
  };
}
