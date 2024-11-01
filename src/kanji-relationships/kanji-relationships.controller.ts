import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { KanjiRelationshipsService } from './kanji-relationships.service';
import { CreateKanjiRelationshipDto } from './dto/create-kanji-relationship.dto';
import { UpdateKanjiRelationshipDto } from './dto/update-kanji-relationship.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { KanjiRelationshipEntity } from './entities/kanji-relationships.entity';
@ApiTags('kanji-relationships')
@Controller('kanjirel')
export class KanjiRelationshipsController {
  constructor(
    private readonly kanjiRelationshipsService: KanjiRelationshipsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: KanjiRelationshipEntity })
  create(@Body() createKanjiRelationshipDto: CreateKanjiRelationshipDto) {
    return this.kanjiRelationshipsService.create(createKanjiRelationshipDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [KanjiRelationshipEntity] })
  findAll() {
    return this.kanjiRelationshipsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiRelationshipsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKanjiRelationshipDto: UpdateKanjiRelationshipDto,
  ) {
    return this.kanjiRelationshipsService.update(
      id,
      updateKanjiRelationshipDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiRelationshipsService.remove(id);
  }
}
