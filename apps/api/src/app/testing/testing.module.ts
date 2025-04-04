import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { TestApiRateLimitBulkController, TestApiRateLimitController } from './rate-limiting.controller';
import { RateLimitingModule } from '../rate-limiting/rate-limiting.module';
import { TestApiAuthController } from './auth.controller';

@Module({
  imports: [SharedModule, AuthModule, RateLimitingModule],
  controllers: [TestingController, TestApiRateLimitController, TestApiRateLimitBulkController, TestApiAuthController],
})
export class TestingModule {}
