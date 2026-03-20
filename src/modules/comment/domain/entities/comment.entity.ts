export class Comment {
  id!: string;
  content!: string;
  email?: string;
  name!: string;
  blogId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; content: string; email?: string; name: string; blogId: string; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, data);
  }
}
