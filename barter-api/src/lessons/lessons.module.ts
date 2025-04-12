import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
// import { FormDataModule } from 'nestjs-form-data'; // Removed as 'FormDataModule' is not exported by 'nestjs-form-data'

@Module({
  imports: [],
  controllers: [LessonsController],
  providers: [LessonsService]
})
export class LessonsModule {}
