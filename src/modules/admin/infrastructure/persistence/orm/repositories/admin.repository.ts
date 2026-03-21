import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationResult } from '@/common/types';
import { Admin } from '@mod/admin/domain';
import { AdminRepositoryOutboundPortService } from '@mod/admin/application/ports/outbound';

@Injectable()
export class AdminRepositoryAdapter implements AdminRepositoryOutboundPortService {
  constructor(private readonly prisma: PrismaService) {}

  async create(admin: Admin): Promise<Admin> {
    const createdAdmin = await this.prisma.admin.create({
      data: {
        id: admin.id,
        name: admin.name,
        displayName: admin.displayName,
        email: admin.email,
        password: admin.password,
        shortBio: admin.shortBio,
        role: admin.role,
        profilePicture: admin.profilePicture,
        isVerified: admin.isVerified,
        isActive: admin.isActive,
      },
    });

    return this.toDomain(createdAdmin);
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    return admin ? this.toDomain(admin) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    return admin ? this.toDomain(admin) : null;
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Admin>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([this.prisma.admin.findMany({ skip, take: limit }), this.prisma.admin.count()]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async update(id: string, admin: Partial<Admin>): Promise<Admin> {
    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: {
        name: admin.name,
        displayName: admin.displayName,
        email: admin.email,
        password: admin.password,
        shortBio: admin.shortBio,
        role: admin.role,
        profilePicture: admin.profilePicture,
        isVerified: admin.isVerified,
        isActive: admin.isActive,
      },
    });

    return this.toDomain(updatedAdmin);
  }

  private toDomain(admin: {
    id: string;
    name: string;
    displayName: string;
    email: string;
    password: string;
    shortBio: string | null;
    role: string;
    profilePicture: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Admin {
    return new Admin({
      id: admin.id,
      name: admin.name,
      displayName: admin.displayName,
      email: admin.email,
      password: admin.password,
      shortBio: admin.shortBio ?? undefined,
      role: admin.role,
      profilePicture: admin.profilePicture ?? undefined,
      isVerified: admin.isVerified,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  }
}
