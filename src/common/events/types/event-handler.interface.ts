import { BaseEvent } from '@/common/events/types/base-event.interface';

/**
 * Interface for event handlers.
 * Implement this interface to create custom event handlers.
 */
export interface EventHandler<T extends BaseEvent = BaseEvent> {
  /**
   * Handle the event
   * @param event The event to handle
   */
  handle(event: T): Promise<void> | void;
}

/**
 * Type for event handler functions
 */
export type EventHandlerFn<T extends BaseEvent = BaseEvent> = (
  event: T,
) => Promise<void> | void;

/**
 * Options for event subscription
 */
export interface SubscriptionOptions {
  /**
   * Whether to handle events asynchronously (fire and forget)
   * Default: true
   */
  async?: boolean;

  /**
   * Priority of the handler (higher = earlier execution)
   * Default: 0
   */
  priority?: number;

  /**
   * Whether to suppress errors in the handler
   * Default: false
   */
  suppressErrors?: boolean;
}
