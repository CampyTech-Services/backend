export class Category {
  id!: string;
  name!: string;
  slug!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; name: string; slug: string; description?: string }) {
    Object.assign(this, data);
  }
}
