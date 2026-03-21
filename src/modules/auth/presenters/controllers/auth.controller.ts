import { Body, Controller, Post } from '@nestjs/common';
import { AdminInboundPortService } from '@mod/admin/application/ports/inbound';
import { LoginAdminDto, LoginAdminResponseDto } from '@mod/admin/application/dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { loginAdminSchema } from '@mod/admin/presenters/http/zod-schema/request';

@Controller('auth/admin')
export class AuthController {
  constructor(private readonly adminService: AdminInboundPortService) {}

  @Post('login')
  login(@Body(new ZodValidationPipe(loginAdminSchema)) loginAdminDto: LoginAdminDto): Promise<LoginAdminResponseDto> {
    return this.adminService.login(loginAdminDto);
  }
}
