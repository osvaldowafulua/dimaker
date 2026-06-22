import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { DownloadsModule } from './modules/downloads/downloads.module';
import { HealthModule } from './modules/health/health.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SearchModule } from './modules/search/search.module';
import { AiModule } from './modules/ai/ai.module';
import { SocialModule } from './modules/social/social.module';
import { AdminModule } from './modules/admin/admin.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { CreatorsModule } from './modules/creators/creators.module';
import { DatabaseModule } from './common/database/database.module';
import { QueueModule } from './common/queue/queue.module';
import { RedisModule } from './common/redis/redis.module';
import { StorageModule } from './common/storage/storage.module';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 120 },
      { name: 'auth', ttl: 60_000, limit: 20 },
      { name: 'download', ttl: 60_000, limit: 30 },
    ]),
    DatabaseModule,
    RedisModule,
    QueueModule,
    StorageModule,
    HealthModule,
    AuthModule,
    CatalogModule,
    CommerceModule,
    UploadsModule,
    DownloadsModule,
    SearchModule,
    AiModule,
    SocialModule,
    AdminModule,
    SubscriptionsModule,
    CreatorsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    RolesGuard,
  ],
})
export class AppModule {}
