import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService } from '@/common/events/services';

/**
 * Events Module
 *
 * Provides a global event bus for inter-module communication.
 * This module enables loose coupling between modules by allowing
 * them to communicate through events instead of direct imports.
 *
 * ## Architecture
 *
 * ```
 * ┌─────────────────┐      ┌─────────────────┐
 * │  User Module  │──────│  Event Bus      │──────│ Admin Module  │
 * └─────────────────┘      │  (Message Bus)  │      └─────────────────┘
 *                          └─────────────────┘
 *                                   │
 *                          ┌────────┴────────┐
 *                          │                 │
 *                   ┌──────┴──────┐   ┌──────┴──────┐
 *                   │ PaymentReq  │   │   Auth      │
 *                   │   Module    │   │   Module    │
 *                   └─────────────┘   └─────────────┘
 * ```
 *
 * ## Features
 *
 * - **Loose Coupling**: Modules communicate via events, no direct imports
 * - **Async by Default**: Events are handled asynchronously
 * - **Wildcard Support**: Subscribe to patterns like 'blog.*'
 * - **Error Isolation**: Handler errors don't affect publishers
 * - **Correlation IDs**: Track related events across modules
 *
 * ## Usage
 *
 * ### Publishing Events (in any module)
 *
 * ```typescript
 * import { EventBusService, createBaseEvent } from '@/common/events';
 *
 * @Injectable()
 * export class blogService {
 *   constructor(private readonly eventBus: EventBusService) {}
 *
 *   async createblog(data: CreateblogDto) {
 *     const blog = await this.repository.create(data);
 *
 *     // Publish event after successful creation
 *     await this.eventBus.publish(
 *       createBaseEvent('blog.created', 'blog-module', {
 *         blogId: blog.id,
 *         reference: blog.reference,
 *       }),
 *     );
 *
 *     return blog;
 *   }
 * }
 * ```
 *
 * ### Subscribing to Events (decorator-based)
 *
 * ```typescript
 * import { OnEvent } from '@nestjs/event-emitter';
 *
 * @Injectable()
 * export class PaymentEventHandler {
 *   @OnEvent('blog.created')
 *   async handleblogCreated(event: blogCreatedEvent) {
 *     // React to blog creation
 *     console.log('blog created:', event.payload);
 *   }
 *
 *   @OnEvent('blog.*')
 *   async handleAllblogEvents(event: BaseEvent) {
 *     // React to all blog events
 *     console.log('blog event:', event.eventName);
 *   }
 * }
 * ```
 *
 * ### Event Naming Convention
 *
 * Events should follow the pattern: `module.action`
 *
 * Examples:
 * - `blog.created`
 * - `blog.settled`
 * - `blog.cancelled`
 * - `payment.completed`
 * - `payment.failed`
 * - `payment-request.created`
 */
@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Use wildcard for pattern matching (blog.* matches blog.created, etc.)
      wildcard: true,
      // Delimiter for event names
      delimiter: '.',
      // Show event name in memory leak message
      verboseMemoryLeak: true,
      // Disable throwing uncaught errors
      ignoreErrors: false,
    }),
  ],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventsModule {}
