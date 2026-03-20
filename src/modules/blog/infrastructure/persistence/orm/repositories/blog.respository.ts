import { PrismaService } from '@/prisma/prisma.service';

export class BlogRepository {
  constructor(private readonly blogepository: PrismaService) {}

  async saveOn(data: any): Promise<any> {
    return this.blogepository.blog.create({ ...data });
  }

  async findOne(data: any): Promise<any> {
    return this.blogepository.blog.findFirst({ where: { ...data } });
  }
}
