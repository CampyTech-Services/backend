import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const formatted = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      throw new BadRequestException({ message: 'Validation error', errors: formatted });
    }
    return result.data;
  }
}
