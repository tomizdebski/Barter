import { Test, TestingModule } from '@nestjs/testing';
import { BartersService } from './barters.service';

describe('BartersService', () => {
  let service: BartersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BartersService],
    }).compile();

    service = module.get<BartersService>(BartersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
