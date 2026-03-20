/**
 * Base interface for all domain events.
 * All events should extend this interface.
 */
export interface BaseEvent<T = unknown> {
  /**
   * Unique event name/type identifier.
   * Format: MODULE.ACTION (e.g., 'charge.created', 'payment.completed')
   */
  readonly eventName: string;

  /**
   * Timestamp when the event was created
   */
  readonly timestamp: Date;

  /**
   * Optional correlation ID for tracing related events
   */
  readonly correlationId?: string;

  /**
   * The event payload/data
   */
  readonly payload: T;

  /**
   * Source module that emitted the event
   */
  readonly source: string;
}

/**
 * Factory function to create base event properties
 */
export function createBaseEvent<T>(eventName: string, source: string, payload: T, correlationId?: string): BaseEvent<T> {
  return {
    eventName,
    source,
    payload,
    timestamp: new Date(),
    correlationId,
  };
}
