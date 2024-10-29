import { Test, TestingModule } from '@nestjs/testing';
import { KanjiRelationshipsController } from './kanji-relationships.controller';
import { KanjiRelationshipsService } from './kanji-relationships.service';

describe('KanjiRelationshipsController', () => {
  let controller: KanjiRelationshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanjiRelationshipsController],
      providers: [KanjiRelationshipsService],
    }).compile();

    controller = module.get<KanjiRelationshipsController>(KanjiRelationshipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
