import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from '@mod/blog/application/services/blog.service';
import { BlogRepositoryOutputPortService } from '@mod/blog/application/ports/outbound/blog-repository-outbound-port.service';
import { LoggerService } from '@/common/logger';
import { Blog } from '@mod/blog/domain/entities';
import { CreateBlogDto, UpdateBlogDto } from '@mod/blog/application/dto';
import { PaginationResult } from '@/common/types';

describe('BlogService', () => {
  let service: BlogService;

  let mockRepository: jest.Mocked<BlogRepositoryOutputPortService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: BlogRepositoryOutputPortService,
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
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    mockRepository = module.get(BlogRepositoryOutputPortService);
    mockLogger = module.get(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a blog successfully', async () => {
      const createBlogDto: CreateBlogDto = {
        title: 'Test Blog',
        slug: 'test-blog',
        featuredImage: 'image.jpg',
        content: 'Content',
        excerpt: 'Excerpt',
        status: 'DRAFT',
        categoryId: 'cat-id',
        authorId: 'auth-id',
      };
      const blog = new Blog(createBlogDto);
      mockRepository.create.mockResolvedValue(blog);

      const result = await service.create(createBlogDto);

      expect(mockLogger.log).toHaveBeenCalledWith(`Creating blog: ${createBlogDto.slug}`);
      expect(mockRepository.create).toHaveBeenCalledWith(blog);
      expect(result).toEqual(blog);
    });
  });

  describe('findById', () => {
    it('should return a blog by id', async () => {
      const blog = new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockRepository.findById.mockResolvedValue(blog);

      const result = await service.findById('id');

      expect(mockRepository.findById).toHaveBeenCalledWith('id');
      expect(result).toEqual(blog);
    });

    it('should return null if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById('id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated blogs', async () => {
      const blogs = [new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' })];
      const paginationResult: PaginationResult<Blog> = { items: blogs, total: 1, page: 1, limit: 10 };
      mockRepository.findAll.mockResolvedValue(paginationResult);

      const result = await service.findAll(1, 10);

      expect(mockRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginationResult);
    });
  });

  describe('findBySlug', () => {
    it('should return a blog by slug', async () => {
      const blog = new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockRepository.findBySlug.mockResolvedValue(blog);

      const result = await service.findBySlug('test');

      expect(mockRepository.findBySlug).toHaveBeenCalledWith('test');
      expect(result).toEqual(blog);
    });
  });

  describe('findByCategoryId', () => {
    it('should return blogs by category id', async () => {
      const blogs = [new Blog({ title: 'Test', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' })];
      mockRepository.findByCategoryId.mockResolvedValue(blogs);

      const result = await service.findByCategoryId('cat');

      expect(mockRepository.findByCategoryId).toHaveBeenCalledWith('cat');
      expect(result).toEqual(blogs);
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const updateBlogDto: UpdateBlogDto = { title: 'Updated' };
      const blog = new Blog({ title: 'Updated', slug: 'test', featuredImage: 'img', content: 'cont', categoryId: 'cat', authorId: 'auth' });
      mockRepository.update.mockResolvedValue(blog);

      const result = await service.update('id', updateBlogDto);

      expect(mockRepository.update).toHaveBeenCalledWith('id', updateBlogDto);
      expect(result).toEqual(blog);
    });
  });

  describe('delete', () => {
    it('should delete a blog', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete('id');

      expect(mockRepository.delete).toHaveBeenCalledWith('id');
      expect(result).toBe(true);
    });
  });
});
