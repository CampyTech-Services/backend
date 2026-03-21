import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';
import { Tag } from '@mod/tag/domain';
import { CreateTagDto, UpdateTagDto } from '../dto';
import { TagInboundPortService } from '../ports/inbound';
import { TagRepositoryOutboundPortService } from '../ports/outbound';

@Injectable()
export class TagService implements TagInboundPortService {
  constructor(
    private readonly tagRepository: TagRepositoryOutboundPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const normalizedSlug = Tag.normalizeSlug(createTagDto.slug);
    this.logger.log(`Creating tag: ${normalizedSlug}`);

    if (await this.tagRepository.findBySlug(normalizedSlug)) {
      throw new ConflictException(`Tag with slug "${normalizedSlug}" already exists`);
    }

    const tag = new Tag({ ...createTagDto, slug: normalizedSlug });
    return this.tagRepository.create(tag);
  }

  async findById(id: string): Promise<Tag | null> {
    return this.tagRepository.findById(id);
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Tag>> {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.tagRepository.findAll(page, limit);
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return this.tagRepository.findBySlug(slug);
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    const nextSlug = updateTagDto.slug ? Tag.normalizeSlug(updateTagDto.slug) : undefined;
    if (nextSlug && nextSlug !== existingTag.slug) {
      const tagWithSlug = await this.tagRepository.findBySlug(nextSlug);
      if (tagWithSlug && tagWithSlug.id !== id) {
        throw new ConflictException(`Tag with slug "${nextSlug}" already exists`);
      }
    }

    const tag = new Tag(existingTag);
    tag.update({ ...updateTagDto, slug: nextSlug });
    return this.tagRepository.update(id, tag);
  }

  async delete(id: string): Promise<boolean> {
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new NotFoundException(`Tag with id "${id}" not found`);
    }

    return this.tagRepository.delete(id);
  }
}
