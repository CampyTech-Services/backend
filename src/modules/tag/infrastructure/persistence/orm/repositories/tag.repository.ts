import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationResult } from '@/common/types';
import { Tag } from '@mod/tag/domain';
import { TagRepositoryOutboundPortService } from '@mod/tag/application/ports/outbound';

@Injectable()
export class TagRepositoryAdapter implements TagRepositoryOutboundPortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tag: Tag): Promise<Tag> {
    const createdTag = await this.prisma.tag.create({
      data: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      },
    });

    return this.toDomain(createdTag);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    return tag ? this.toDomain(tag) : null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Tag>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.prisma.tag.findMany({ skip, take: limit }), this.prisma.tag.count()]);
    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { slug } });
    return tag ? this.toDomain(tag) : null;
  }

  async update(id: string, tag: Partial<Tag>): Promise<Tag> {
    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data: {
        name: tag.name,
        slug: tag.slug,
      },
    });

    return this.toDomain(updatedTag);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.tag.delete({ where: { id } });
    return true;
  }

  private toDomain(tag: { id: string; name: string; slug: string; createdAt: Date; updatedAt: Date }): Tag {
    return new Tag({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  }
}
