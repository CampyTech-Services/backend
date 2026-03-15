import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import { AdminModule } from './modules/admin/admin.module';
import { EventsModule } from './common/events';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({}),
    BlogModule,
    AdminModule,
    EventsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
