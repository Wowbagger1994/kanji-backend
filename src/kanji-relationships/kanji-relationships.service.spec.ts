import { Test, TestingModule } from '@nestjs/testing';
import { KanjiRelationshipsService } from './kanji-relationships.service';

describe('KanjiRelationshipsService', () => {
  let service: KanjiRelationshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KanjiRelationshipsService],
    }).compile();

    service = module.get<KanjiRelationshipsService>(KanjiRelationshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
