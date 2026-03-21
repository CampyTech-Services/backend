import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './common/events';
import { PERSISTENCE_DRIVERS } from './common/constants';
import { BlogModule } from './modules/blog/blog.module';
import { CommentModule } from './modules/comment/comment.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { LoggerModule } from './common/logger';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({}),
    SentryModule.forRoot(),
    EventsModule,
    BlogModule,
    CommentModule,
    TagModule,
    CategoryModule,
    LoggerModule.registerAsync({
      useFactory: () => ({
        json: false,
        appName: 'campytech-backend',
      }),
    }),
    AdminModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
