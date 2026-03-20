export class Blog {
  id!: string;
  title!: string;
  slug!: string;
  featuredImage!: string;
  content!: string;
  excerpt?: string;
  status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId!: string;
  authorId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: {
    id?: string;
    title: string;
    slug: string;
    featuredImage: string;
    content: string;
    excerpt?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    categoryId: string;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, data);
    if (!this.status) this.status = 'DRAFT';
  }
}
