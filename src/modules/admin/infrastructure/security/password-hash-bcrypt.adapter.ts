import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHashOutboundPortService } from '@mod/admin/application/ports/outbound';

@Injectable()
export class PasswordHashBcryptAdapter implements PasswordHashOutboundPortService {
  private readonly saltRounds = 10;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
