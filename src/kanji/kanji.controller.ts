import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { UpdateKanjiDto } from './dto/update-kanji.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { KanjiEntity } from './entities/kanji.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('kanji')
@Controller('kanji')
export class KanjiController {
  constructor(private readonly kanjiService: KanjiService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity, isArray: true })
  findAll() {
    return this.kanjiService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity, isArray: true })
  findBase() {
    return this.kanjiService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity })
  async findOnebyId(@Param('id', ParseIntPipe) id: number) {
    const kanji = await this.kanjiService.findOneById(+id);
    if (!kanji) {
      throw new NotFoundException(`Kanji with ID ${id} not found`);
    }
    return kanji;
  }

  @Get(':kanji')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity })
  async findOnebyLiteral(@Param('kanji') kanji: string) {
    const k = await this.kanjiService.findOneByLiteral(kanji);
    if (!k) {
      throw new NotFoundException(`Kanji with literal ${kanji} not found`);
    }
    return k;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKanjiDto: UpdateKanjiDto,
  ) {
    return this.kanjiService.update(+id, updateKanjiDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: KanjiEntity })
  setAsBase(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiService.setAsBase(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity })
  setAsNotBase(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiService.setAsNotBase(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiService.remove(+id);
  }
}
