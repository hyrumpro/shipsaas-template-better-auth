// lib/logger.ts
// Production-ready logging utility with PII redaction and request-id support

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

const PII_KEYS = new Set([
  "email",
  "customer_email",
  "customerEmail",
  "user_email",
  "from",
  "to",
  "cc",
  "bcc",
  "replyTo",
  "reply_to",
  "phone",
  "phoneNumber",
  "phone_number",
  "customer",
  "address",
  "billingAddress",
  "shippingAddress",
  "ssn",
  "taxId",
  "tax_id",
  "vatNumber",
  "password",
  "secret",
  "apiKey",
  "api_key",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "setCookie",
  "set_cookie",
  "session",
  "sessionId",
  "session_id",
]);

const REDACTED = "[REDACTED]";

function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[truncated]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "[email]";
    if (/^[A-Z0-9]{24,}$/.test(value)) return "[token]";
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => redactValue(v, depth + 1));
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (PII_KEYS.has(k) || /email/i.test(k)) {
        out[k] = REDACTED;
      } else {
        out[k] = redactValue(v, depth + 1);
      }
    }
    return out;
  }
  return value;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isProduction = process.env.NODE_ENV === "production";

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private sanitize(context?: LogContext): LogContext | undefined {
    if (!context) return context;
    return redactValue(context) as LogContext;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      return level === "warn" || level === "error";
    }
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, this.sanitize(context)));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, this.sanitize(context)));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, this.sanitize(context)));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      const errorContext = {
        ...this.sanitize(context),
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        } : error,
      };
      console.error(this.formatMessage("error", message, errorContext));

      // In production, you would send this to error tracking service
      // Example: Sentry.captureException(error);
    }
  }

  auth(action: string, userId?: string, success: boolean = true): void {
    this.info(`Auth: ${action}`, { userId, success, category: "auth" });
  }

  payment(action: string, details: Record<string, unknown>): void {
    this.info(`Payment: ${action}`, { ...details, category: "payment" });
  }

  database(operation: string, table: string, success: boolean): void {
    this.info(`DB: ${operation} on ${table}`, {
      table,
      operation,
      success,
      category: "database",
    });
  }

  api(method: string, endpoint: string, statusCode: number, duration?: number): void {
    const level = statusCode >= 400 ? "warn" : "info";
    this[level](`API: ${method} ${endpoint}`, {
      method,
      endpoint,
      statusCode,
      duration,
      category: "api",
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports
export const log = logger;
export default logger;
