import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TransformAmountPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'body') {
      return value;
    }

    return this.transformAmounts(value);
  }

  private transformAmounts(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformAmounts(item));
    }

    if (typeof obj === 'object') {
      const transformed: Record<string, any> = {};

      for (const [key, val] of Object.entries(obj)) {
        if (key === 'amount' && typeof val === 'number') {
          transformed[key] = val / 100;
        } else if (typeof val === 'object') {
          transformed[key] = this.transformAmounts(val);
        } else {
          transformed[key] = val;
        }
      }

      return transformed;
    }

    return obj;
  }
}
