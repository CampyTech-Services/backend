import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from '@mod/blog/presenters/controllers/blog.controller';
import { BlogInboundPortService } from '@mod/blog/application/ports/inbound/blog-inbound-port.service';
import { Blog } from '@mod/blog/domain/entities';
import { CreateBlogDto, UpdateBlogDto } from '@mod/blog/application/dto';
import { PaginationResult } from '@/common/types';

describe('BlogController', () => {
  let controller: BlogController;
  let mockService: jest.Mocked<BlogInboundPortService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogInboundPortService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            findByCategoryId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    mockService = module.get(BlogInboundPortService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog', async () => {
      const createBlogDto: CreateBlogDto = {
        title: 'Test',
        slug: 'test',
        featuredImage: 'img',
        content: 'cont',
        categoryId: 'cat',
        authorId: 'auth',
      };
      const blog = new Blog(createBlogDto);
      mockService.create.mockResolvedValue(blog);

      const result = await controller.create(createBlogDto);

      expect(mockService.create).toHaveBeenCalledWith(createBlogDto);
      expect(result).toEqual(blog);
    });
  });

  describe('findAll', () => {
    it('should return paginated blogs', async () => {
      const blogs = [new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' })];
      const paginationResult: PaginationResult<Blog> = { items: blogs, total: 1, page: 1, limit: 10 };
      mockService.findAll.mockResolvedValue(paginationResult);

      const result = await controller.findAll('1', '10');

      expect(mockService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginationResult);
    });
  });

  describe('findById', () => {
    it('should return a blog by id', async () => {
      const blog = new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockService.findById.mockResolvedValue(blog);

      const result = await controller.findById('id');

      expect(mockService.findById).toHaveBeenCalledWith('id');
      expect(result).toEqual(blog);
    });
  });

  describe('findBySlug', () => {
    it('should return a blog by slug', async () => {
      const blog = new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockService.findBySlug.mockResolvedValue(blog);

      const result = await controller.findBySlug('test');

      expect(mockService.findBySlug).toHaveBeenCalledWith('test');
      expect(result).toEqual(blog);
    });
  });

  describe('findByCategoryId', () => {
    it('should return blogs by category id', async () => {
      const blogs = [new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' })];
      mockService.findByCategoryId.mockResolvedValue(blogs);

      const result = await controller.findByCategoryId('cat');

      expect(mockService.findByCategoryId).toHaveBeenCalledWith('cat');
      expect(result).toEqual(blogs);
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const updateBlogDto: UpdateBlogDto = { title: 'Updated' };
      const blog = new Blog({ title: 'Updated', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockService.update.mockResolvedValue(blog);

      const result = await controller.update('id', updateBlogDto);

      expect(mockService.update).toHaveBeenCalledWith('id', updateBlogDto);
      expect(result).toEqual(blog);
    });
  });

  describe('delete', () => {
    it('should delete a blog', async () => {
      mockService.delete.mockResolvedValue(true);

      const result = await controller.delete('id');

      expect(mockService.delete).toHaveBeenCalledWith('id');
      expect(result).toBe(true);
    });
  });
});
