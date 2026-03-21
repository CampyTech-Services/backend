import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaginationResult } from '@/common/types';
import { TagInboundPortService } from '@mod/tag/application/ports/inbound';
import { Tag } from '@mod/tag/domain';

@Controller('api/tag')
export class PublicTagController {
  constructor(private readonly tagService: TagInboundPortService) {}

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
}
