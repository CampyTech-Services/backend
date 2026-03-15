import { Module } from '@nestjs/common';

@Module({})
export class AdminModule {
  static register() {
    return { module: AdminModule, imports: [], exports: [] };
  }
}
