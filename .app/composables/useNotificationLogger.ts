export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogCategory {
  NOTIFICATION_DELIVERY = 'NOTIFICATION_DELIVERY',
  NOTIFICATION_TOKEN = 'NOTIFICATION_TOKEN',
  SCHEDULING = 'SCHEDULING',
  TEMPLATE_RENDERING = 'TEMPLATE_RENDERING',
  USER_GROUPS = 'USER_GROUPS',
  CAMPAIGNS = 'CAMPAIGNS',
  SERVICE_WORKER = 'SERVICE_WORKER',
  DATABASE = 'DATABASE',
  SYSTEM = 'SYSTEM',
  PERFORMANCE = 'PERFORMANCE',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel | string;
  category: LogCategory | string;
  message: string;
  component?: string;
  method?: string;
  duration_ms?: number;
  user_id?: string;
  details?: Record<string, any>;
  error_stack?: string;
  memory_usage?: number;
  user_agent?: string;
  ip_address?: string;
  session_id?: string;
  created?: string;
  updated?: string;
}

interface LogOptions {
  startDate?: Date;
  endDate?: Date;
  level?: LogLevel | string;
  category?: LogCategory | string;
  limit?: number;
}

export function useNotificationLogger() {
  const { $pb } = useNuxtApp();

  const log = async (
    level: LogLevel,
    category: LogCategory,
    message: string,
    options?: {
      component?: string;
      method?: string;
      duration_ms?: number;
      details?: Record<string, any>;
      error?: Error;
    },
  ): Promise<void> => {
    try {
      const logEntry: Partial<LogEntry> = {
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        component: options?.component,
        method: options?.method,
        duration_ms: options?.duration_ms,
        details: options?.details,
        error_stack: options?.error?.stack,
        user_id: $pb.authStore?.model?.id,
      };

      // Try to save to PocketBase if collection exists
      try {
        await $pb.collection('system_logs').create(logEntry);
      }
      catch (error) {
        // If collection doesn't exist, just log to console
        console.log('[Logger]', level, category, message, options);
      }
    }
    catch (error) {
      console.error('Failed to log:', error);
    }
  };

  const debug = (category: LogCategory, message: string, options?: any) => {
    return log(LogLevel.DEBUG, category, message, options);
  };

  const info = (category: LogCategory, message: string, options?: any) => {
    return log(LogLevel.INFO, category, message, options);
  };

  const warn = (category: LogCategory, message: string, options?: any) => {
    return log(LogLevel.WARN, category, message, options);
  };

  const error = (category: LogCategory, message: string, options?: any) => {
    return log(LogLevel.ERROR, category, message, options);
  };

  const critical = (category: LogCategory, message: string, options?: any) => {
    return log(LogLevel.CRITICAL, category, message, options);
  };

  const getLogs = async (options?: LogOptions): Promise<LogEntry[]> => {
    try {
      const filters: string[] = [];

      if (options?.startDate) {
        filters.push(`created >= "${options.startDate.toISOString()}"`);
      }
      if (options?.endDate) {
        filters.push(`created <= "${options.endDate.toISOString()}"`);
      }
      if (options?.level) {
        filters.push(`level = "${options.level}"`);
      }
      if (options?.category) {
        filters.push(`category = "${options.category}"`);
      }

      const filter = filters.length > 0 ? filters.join(' && ') : '';

      const result = await $pb.collection('system_logs').getList(1, options?.limit || 100, {
        filter,
        sort: '-created',
      });

      return result.items as LogEntry[];
    }
    catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  };

  const cleanupOldLogs = async (daysToKeep: number): Promise<void> => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const filter = `created < "${cutoffDate.toISOString()}"`;

      const logsToDelete = await $pb.collection('system_logs').getFullList({
        filter,
      });

      for (const log of logsToDelete) {
        await $pb.collection('system_logs').delete(log.id);
      }
    }
    catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  };

  return {
    log,
    debug,
    info,
    warn,
    error,
    critical,
    getLogs,
    cleanupOldLogs,
    LogLevel,
    LogCategory,
  };
}
