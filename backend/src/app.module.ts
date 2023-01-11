import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal: true,
            }),
            AuthModule,
            UserModule,
            TestModule,
            BookmarkModule,
            PrismaModule],
  providers: [ChatGateway],
})
export class AppModule {}
