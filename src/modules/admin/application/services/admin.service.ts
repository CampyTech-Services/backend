import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from '@/common/logger';
import { PaginationResult } from '@/common/types';
import { Admin } from '@mod/admin/domain';
import { ChangePasswordDto, CreateAdminDto, LoginAdminDto, LoginAdminResponseDto, UpdateAdminDto, UpdateAdminStatusDto, UpdateAdminVerificationDto } from '../dto';
import { AdminInboundPortService } from '../ports/inbound';
import { AdminAuthTokenOutboundPortService, AdminRepositoryOutboundPortService, PasswordHashOutboundPortService } from '../ports/outbound';

@Injectable()
export class AdminService implements AdminInboundPortService {
  constructor(
    private readonly adminRepository: AdminRepositoryOutboundPortService,
    private readonly passwordHash: PasswordHashOutboundPortService,
    private readonly authToken: AdminAuthTokenOutboundPortService,
    private readonly logger: LoggerService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const normalizedEmail = Admin.normalizeEmail(createAdminDto.email);
    this.logger.log(`Creating admin: ${normalizedEmail}`);

    if (await this.adminRepository.findByEmail(normalizedEmail)) {
      throw new ConflictException(`Admin with email "${normalizedEmail}" already exists`);
    }

    const hashedPassword = await this.passwordHash.hash(createAdminDto.password);
    const admin = new Admin({
      ...createAdminDto,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return this.adminRepository.create(admin);
  }

  async login(loginAdminDto: LoginAdminDto): Promise<LoginAdminResponseDto> {
    const normalizedEmail = Admin.normalizeEmail(loginAdminDto.email);
    const admin = await this.adminRepository.findByEmail(normalizedEmail);

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    const passwordMatches = await this.passwordHash.compare(loginAdminDto.password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.authToken.signAccessToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      isVerified: admin.isVerified,
    });

    return {
      accessToken: token.accessToken,
      expiresIn: token.expiresIn,
      admin: this.toAuthenticatedAdmin(admin),
    };
  }

  async findAll(page = 1, limit = 10): Promise<PaginationResult<Admin>> {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be positive integers');
    }

    return this.adminRepository.findAll(page, limit);
  }

  async findById(id: string): Promise<Admin | null> {
    return this.adminRepository.findById(id);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.requireAdmin(id);
    const normalizedEmail = updateAdminDto.email ? Admin.normalizeEmail(updateAdminDto.email) : undefined;

    if (normalizedEmail && normalizedEmail !== admin.email) {
      const adminWithEmail = await this.adminRepository.findByEmail(normalizedEmail);
      if (adminWithEmail && adminWithEmail.id !== id) {
        throw new ConflictException(`Admin with email "${normalizedEmail}" already exists`);
      }
    }

    const updatedAdmin = new Admin(admin);
    updatedAdmin.updateProfile({ ...updateAdminDto, email: normalizedEmail });
    return this.adminRepository.update(id, updatedAdmin);
  }

  async updateStatus(id: string, updateAdminStatusDto: UpdateAdminStatusDto): Promise<Admin> {
    const admin = await this.requireAdmin(id);
    const updatedAdmin = new Admin(admin);
    updatedAdmin.setActiveStatus(updateAdminStatusDto.isActive);
    return this.adminRepository.update(id, updatedAdmin);
  }

  async updateVerification(id: string, updateAdminVerificationDto: UpdateAdminVerificationDto): Promise<Admin> {
    const admin = await this.requireAdmin(id);
    const updatedAdmin = new Admin(admin);
    updatedAdmin.setVerifiedStatus(updateAdminVerificationDto.isVerified);
    return this.adminRepository.update(id, updatedAdmin);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const admin = await this.requireAdmin(id);
    const passwordMatches = await this.passwordHash.compare(changePasswordDto.currentPassword, admin.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Current password is invalid');
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password must be different from the current password');
    }

    const hashedPassword = await this.passwordHash.hash(changePasswordDto.newPassword);
    const updatedAdmin = new Admin(admin);
    updatedAdmin.setPassword(hashedPassword);
    await this.adminRepository.update(id, updatedAdmin);
    return true;
  }

  private async requireAdmin(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id "${id}" not found`);
    }

    return admin;
  }

  private toAuthenticatedAdmin(admin: Admin): LoginAdminResponseDto['admin'] {
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
