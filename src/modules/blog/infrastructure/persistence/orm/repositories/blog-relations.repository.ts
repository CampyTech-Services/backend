import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BlogRelationsOutboundPortService } from '@mod/blog/application/ports/outbound';

@Injectable()
export class BlogRelationsPrismaAdapter implements BlogRelationsOutboundPortService {
  constructor(private readonly prisma: PrismaService) {}

  async categoryExists(categoryId: string): Promise<boolean> {
    const count = await this.prisma.category.count({ where: { id: categoryId } });
    return count > 0;
  }

  async authorExists(authorId: string): Promise<boolean> {
    const count = await this.prisma.admin.count({ where: { id: authorId } });
    return count > 0;
  }

  async countExistingTags(tagIds: string[]): Promise<number> {
    return this.prisma.tag.count({ where: { id: { in: tagIds } } });
  }
}
