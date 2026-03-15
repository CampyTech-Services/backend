import { ulid } from 'ulid';

export class HashUtil {
  static generateIdentifier(length: number): string {
    return ulid().slice(0, length);
  }
}
