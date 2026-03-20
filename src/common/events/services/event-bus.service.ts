import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseEvent, EventHandlerFn, SubscriptionOptions } from '@/common/events/types';
import { COMMON_LOG_MESSAGES } from '@/common/constants';

const { EVENT_BUS: EVENT_LOG } = COMMON_LOG_MESSAGES;

/**
 * Event Bus Service
 *
 * Provides a centralized event bus for inter-module communication.
 * Uses NestJS EventEmitter2 under the hood for reliable event handling.
 *
 * ## Usage
 *
 * ### Publishing Events
 * ```typescript
 * // Inject the service
 * constructor(private readonly eventBus: EventBusService) {}
 *
 * // Publish an event
 * await this.eventBus.publish({
 *   eventName: 'blog.created',
 *   source: 'blog-module',
 *   payload: { blogId: '123', amount: 5000 },
 *   timestamp: new Date(),
 * });
 * ```
 *
 * ### Subscribing to Events (Programmatic)
 * ```typescript
 * this.eventBus.subscribe('blog.created', async (event) => {
 *   console.log('blog created:', event.payload);
 * });
 * ```
 *
 * ### Subscribing to Events (Decorator-based)
 * ```typescript
 * @OnEvent('blog.created')
 * async handleblogCreated(event: blogCreatedEvent) {
 *   // Handle the event
 * }
 * ```
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Publish an event to all subscribers
   * @param event The event to publish
   * @returns Promise resolving to an array of values returned by each handler
   */
  async publish<T extends BaseEvent>(event: T): Promise<unknown[]> {
    this.logger.debug(EVENT_LOG.PUBLISHING(event.eventName, event.source));

    try {
      // Emit the specific event and collect handler return values.
      // Wildcard listeners (e.g., 'blog.*') are automatically matched
      // by EventEmitter2 when wildcard mode is enabled — no manual
      // re-emission is needed.
      const results = await this.eventEmitter.emitAsync(event.eventName, event);

      this.logger.debug(EVENT_LOG.PUBLISHED(event.eventName));
      return results;
    } catch (error) {
      this.logger.error(EVENT_LOG.PUBLISH_ERROR(event.eventName, error.message), error.stack);
      throw error;
    }
  }

  /**
   * Publish an event without waiting for handlers to complete
   * @param event The event to publish
   */
  publishAsync<T extends BaseEvent>(event: T): void {
    this.logger.debug(EVENT_LOG.PUBLISHING_ASYNC(event.eventName, event.source));

    // Fire and forget
    // Wildcard listeners are automatically matched by EventEmitter2.
    this.eventEmitter.emit(event.eventName, event);
  }

  /**
   * Subscribe to an event
   * @param eventName The event name or pattern to subscribe to
   * @param handler The handler function
   * @param options Subscription options
   * @returns Unsubscribe function
   */
  subscribe<T extends BaseEvent>(eventName: string, handler: EventHandlerFn<T>, options: SubscriptionOptions = {}): () => void {
    const { async = true, suppressErrors = false } = options;

    const wrappedHandler = async (event: T) => {
      try {
        if (async) {
          // Fire and forget
          Promise.resolve(handler(event)).catch((error) => {
            if (!suppressErrors) {
              this.logger.error(EVENT_LOG.HANDLER_ERROR(eventName, error.message), error.stack);
            }
          });
        } else {
          await handler(event);
        }
      } catch (error) {
        if (!suppressErrors) {
          this.logger.error(`Error in event handler for ${eventName}: ${error.message}`, error.stack);
          throw error;
        }
      }
    };

    this.eventEmitter.on(eventName, wrappedHandler);

    this.logger.debug(EVENT_LOG.SUBSCRIBED(eventName));

    // Return unsubscribe function
    return () => {
      this.eventEmitter.off(eventName, wrappedHandler);
      this.logger.debug(EVENT_LOG.UNSUBSCRIBED(eventName));
    };
  }

  /**
   * Subscribe to an event for one-time handling
   * @param eventName The event name to subscribe to
   * @param handler The handler function
   */
  once<T extends BaseEvent>(eventName: string, handler: EventHandlerFn<T>): void {
    this.eventEmitter.once(eventName, handler);
    this.logger.debug(EVENT_LOG.SUBSCRIBED_ONCE(eventName));
  }

  /**
   * Check if there are any listeners for an event
   * @param eventName The event name to check
   */
  hasListeners(eventName: string): boolean {
    return this.eventEmitter.listenerCount(eventName) > 0;
  }

  /**
   * Get the count of listeners for an event
   * @param eventName The event name to check
   */
  listenerCount(eventName: string): number {
    return this.eventEmitter.listenerCount(eventName);
  }

  /**
   * Remove all listeners for a specific event
   * @param eventName The event name
   */
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.eventEmitter.removeAllListeners(eventName);
      this.logger.debug(EVENT_LOG.REMOVED_LISTENERS(eventName));
    } else {
      this.eventEmitter.removeAllListeners();
      this.logger.debug(EVENT_LOG.REMOVED_ALL_LISTENERS);
    }
  }
}
