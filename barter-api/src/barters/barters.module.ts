import { Module } from '@nestjs/common';
import { BartersService } from './barters.service';
import { BartersController } from './barters.controller';

@Module({
  providers: [BartersService],
  controllers: [BartersController]
})
export class BartersModule {}
