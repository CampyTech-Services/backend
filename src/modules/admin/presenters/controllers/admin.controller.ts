import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { PaginationResult } from '@/common/types';
import { AdminInboundPortService } from '@mod/admin/application/ports/inbound';
import { ChangePasswordDto, CreateAdminDto, UpdateAdminDto, UpdateAdminStatusDto, UpdateAdminVerificationDto } from '@mod/admin/application/dto';
import { Admin } from '@mod/admin/domain';
import { changePasswordSchema, createAdminSchema, updateAdminSchema, updateAdminStatusSchema, updateAdminVerificationSchema } from '../http/zod-schema/request';

export interface AdminPublicResponse {
  id: string;
  name: string;
  displayName: string;
  email: string;
  shortBio?: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminInboundPortService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createAdminSchema)) createAdminDto: CreateAdminDto): Promise<AdminPublicResponse> {
    const admin = await this.adminService.create(createAdminDto);
    return this.toPublic(admin);
  }
  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number): Promise<PaginationResult<AdminPublicResponse>> {
    const result = await this.adminService.findAll(page, limit);
    return {
      ...result,
      items: result.items.map((admin) => this.toPublic(admin)),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<AdminPublicResponse | null> {
    const admin = await this.adminService.findById(id);
    return admin ? this.toPublic(admin) : null;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ZodValidationPipe(updateAdminSchema)) updateAdminDto: UpdateAdminDto): Promise<AdminPublicResponse> {
    const admin = await this.adminService.update(id, updateAdminDto);
    return this.toPublic(admin);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body(new ZodValidationPipe(updateAdminStatusSchema)) updateAdminStatusDto: UpdateAdminStatusDto): Promise<AdminPublicResponse> {
    const admin = await this.adminService.updateStatus(id, updateAdminStatusDto);
    return this.toPublic(admin);
  }

  @Put(':id/verify')
  async updateVerification(@Param('id') id: string, @Body(new ZodValidationPipe(updateAdminVerificationSchema)) updateAdminVerificationDto: UpdateAdminVerificationDto): Promise<AdminPublicResponse> {
    const admin = await this.adminService.updateVerification(id, updateAdminVerificationDto);
    return this.toPublic(admin);
  }

  @Put(':id/password')
  changePassword(@Param('id') id: string, @Body(new ZodValidationPipe(changePasswordSchema)) changePasswordDto: ChangePasswordDto): Promise<boolean> {
    return this.adminService.changePassword(id, changePasswordDto);
  }

  private toPublic(admin: Admin): AdminPublicResponse {
    return {
      id: admin.id,
      name: admin.name,
      displayName: admin.displayName,
      email: admin.email,
      shortBio: admin.shortBio,
      role: admin.role,
      profilePicture: admin.profilePicture,
      isVerified: admin.isVerified,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
