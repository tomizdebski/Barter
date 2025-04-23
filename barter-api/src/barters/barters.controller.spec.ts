import { Test, TestingModule } from '@nestjs/testing';
import { BartersController } from './barters.controller';

describe('BartersController', () => {
  let controller: BartersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BartersController],
    }).compile();

    controller = module.get<BartersController>(BartersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
