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
  Query,
} from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { UpdateKanjiDto } from './dto/update-kanji.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
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

  @Get('page/:page/perPage/:perPage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Results per page',
    example: 100,
  })
  @ApiOkResponse({ type: KanjiEntity, isArray: true })
  findAllPagination(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('perPage', ParseIntPipe) perPage: number = 100,
  ) {
    return this.kanjiService.findAllPagination(page, perPage);
  }

  @Get('base')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Results per page',
    example: 100,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: KanjiEntity, isArray: true })
  findBase(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('perPage', ParseIntPipe) perPage: number = 10,
  ) {
    return this.kanjiService.findAll();
  }

  @Get('id/:id')
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

  @Get('literal/:kanji')
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

  @Patch('/setAsBase:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: KanjiEntity })
  setAsBase(@Param('id', ParseIntPipe) id: number) {
    return this.kanjiService.setAsBase(+id);
  }

  @Patch('/setAsNotBase:id')
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
