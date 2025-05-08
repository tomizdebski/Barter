import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { QuizModule } from './quiz/quiz.module';
import { LessonsModule } from './lessons/lessons.module';
import { CategoriesModule } from './categories/categories.module';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
import { BartersModule } from './barters/barters.module';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads/',
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    QuizModule,
    LessonsModule,
    CategoriesModule,
    ChatModule,
    MessagesModule,
    BartersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
