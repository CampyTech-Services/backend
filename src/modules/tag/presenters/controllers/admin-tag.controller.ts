import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { PaginationResult } from '@/common/types';
import { CreateTagDto, UpdateTagDto } from '@mod/tag/application/dto';
import { TagInboundPortService } from '@mod/tag/application/ports/inbound';
import { Tag } from '@mod/tag/domain';
import { createTagSchema, updateTagSchema } from '../http/zod-schema/request';
import { AdminAuthGuard } from '@/modules/auth/guards';

@UseGuards(AdminAuthGuard)
@Controller('admin/tag')
export class AdminTagController {
  constructor(private readonly tagService: TagInboundPortService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createTagSchema)) createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginationResult<Tag>> {
    return this.tagService.findAll(page, limit);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Tag | null> {
    return this.tagService.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Tag | null> {
    return this.tagService.findBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateTagSchema)) updateTagDto: UpdateTagDto): Promise<Tag> {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.tagService.delete(id);
  }
}
