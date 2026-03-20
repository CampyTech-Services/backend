import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from '../../application/dto';
import { Comment } from '../../domain/entities';
import { CommentInboundPortService } from '@mod/comment/application/ports/inbound/comment-inbound-port.service';
import { PaginationResult } from '@/common/types';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentInboundPortService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10'): Promise<PaginationResult<Comment>> {
    return this.commentService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Comment | null> {
    return this.commentService.findById(id);
  }

  @Get('blog/:blogId')
  findByBlogId(@Param('blogId') blogId: string): Promise<Comment[]> {
    return this.commentService.findByBlogId(blogId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.commentService.delete(id);
  }
}
