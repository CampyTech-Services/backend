import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBusService } from '@/common/events/services';

/**
 * Global events infrastructure for the application.
 *
 * Registers `EventEmitter2` once and exposes {@link EventBusService}
 * as a global provider so feature modules can publish and subscribe to
 * in-process domain events without taking direct dependencies on each other.
 *
 * In this application, the module is intended for cross-module flows such as:
 * - a blog action triggering notifications or audit logging
 * - an admin action triggering downstream side effects
 * - content lifecycle events being observed by other bounded contexts
 *
 * ## Why this module exists
 *
 * It keeps application services focused on their own use case.
 * A module can emit an event such as `blog.created` and any interested
 * listener can react to it independently.
 *
 * ## Configuration
 *
 * - `wildcard: true` enables subscriptions such as `blog.*`
 * - `delimiter: '.'` makes dot-separated event names first-class
 * - `verboseMemoryLeak: true` improves diagnostics when too many listeners are registered
 * - `ignoreErrors: false` keeps emitter errors visible instead of silently swallowing them
 *
 * ## Usage
 *
 * ### Publishing an event
 *
 * ```typescript
 * import { EventBusService, createBaseEvent } from '@/common/events';
 *
 * @Injectable()
 * export class BlogService {
 *   constructor(private readonly eventBus: EventBusService) {}
 *
 *   async createBlog(data: CreateBlogDto) {
 *     const blog = await this.repository.create(data);
 *
 *     await this.eventBus.publish(
 *       createBaseEvent('blog.created', 'blog-module', {
 *         blogId: blog.id,
 *         authorId: blog.authorId,
 *       }),
 *     );
 *
 *     return blog;
 *   }
 * }
 * ```
 *
 * ### Subscribing with `@OnEvent`
 *
 * ```typescript
 * import { OnEvent } from '@nestjs/event-emitter';
 *
 * @Injectable()
 * export class BlogEventHandler {
 *   @OnEvent('blog.created')
 *   async handleBlogCreated(event: BaseEvent<{ blogId: string; authorId: string }>) {
 *     console.log('blog created:', event.payload.blogId);
 *   }
 *
 *   @OnEvent('blog.*')
 *   async handleAllBlogEvents(event: BaseEvent) {
 *     console.log('blog event:', event.eventName);
 *   }
 * }
 * ```
 *
 * ### Event Naming Convention
 *
 * Prefer the pattern `context.action`.
 * Use names that describe a completed domain fact, not a controller method name.
 *
 * Examples:
 * - `blog.created`
 * - `blog.published`
 * - `comment.created`
 * - `admin.created`
 * - `admin.password-changed`
 * - `category.updated`
 * - `tag.deleted`
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
