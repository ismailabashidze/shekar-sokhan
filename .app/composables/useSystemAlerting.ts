import type { SystemAlert } from './useNotificationMonitoring';

export interface AlertingRule {
  id?: string;
  name: string;
  description: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notification_channels: string[];
  created?: string;
  updated?: string;
}

export function useSystemAlerting() {
  const { $pb } = useNuxtApp();

  const processAlert = async (alert: SystemAlert): Promise<void> => {
    try {
      console.log('Processing alert:', alert);

      if (alert.severity === 'critical' || alert.severity === 'high') {
        console.warn(`${alert.severity.toUpperCase()} ALERT:`, alert.title, alert.message);
      }
    }
    catch (error) {
      console.error('Failed to process alert:', error);
    }
  };

  const evaluateRules = async (): Promise<SystemAlert[]> => {
    try {
      const rules = await getRules();
      const triggeredAlerts: SystemAlert[] = [];

      for (const rule of rules) {
        if (rule.enabled) {
          const shouldTrigger = await evaluateRule(rule);
          if (shouldTrigger) {
            const alert: Partial<SystemAlert> = {
              severity: rule.severity,
              title: rule.name,
              message: rule.description,
              category: 'SYSTEM',
              acknowledged: false,
              auto_resolved: false,
            };

            try {
              const createdAlert = await $pb.collection('system_alerts').create(alert);
              triggeredAlerts.push(createdAlert as SystemAlert);
            }
            catch (error) {
              console.error('Failed to create alert:', error);
            }
          }
        }
      }

      return triggeredAlerts;
    }
    catch (error) {
      console.error('Failed to evaluate rules:', error);
      return [];
    }
  };

  const evaluateRule = async (rule: AlertingRule): Promise<boolean> => {
    try {
      return false;
    }
    catch (error) {
      console.error('Failed to evaluate rule:', error);
      return false;
    }
  };

  const getRules = async (): Promise<AlertingRule[]> => {
    try {
      const result = await $pb.collection('alerting_rules').getList(1, 100, {
        filter: 'enabled = true',
      });
      return result.items as AlertingRule[];
    }
    catch (error) {
      console.error('Failed to get alerting rules:', error);
      return [];
    }
  };

  const createRule = async (rule: Partial<AlertingRule>): Promise<AlertingRule | null> => {
    try {
      const result = await $pb.collection('alerting_rules').create(rule);
      return result as AlertingRule;
    }
    catch (error) {
      console.error('Failed to create alerting rule:', error);
      return null;
    }
  };

  const updateRule = async (ruleId: string, updates: Partial<AlertingRule>): Promise<boolean> => {
    try {
      await $pb.collection('alerting_rules').update(ruleId, updates);
      return true;
    }
    catch (error) {
      console.error('Failed to update alerting rule:', error);
      return false;
    }
  };

  const deleteRule = async (ruleId: string): Promise<boolean> => {
    try {
      await $pb.collection('alerting_rules').delete(ruleId);
      return true;
    }
    catch (error) {
      console.error('Failed to delete alerting rule:', error);
      return false;
    }
  };

  return {
    processAlert,
    evaluateRules,
    evaluateRule,
    getRules,
    createRule,
    updateRule,
    deleteRule,
  };
}
