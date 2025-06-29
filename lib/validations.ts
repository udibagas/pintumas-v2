import { z } from 'zod'

// User schemas
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER'),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const UpdateUserSchema = UserSchema.omit({ password: true }).extend({
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

// Category schemas
export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string().regex(/^bg-\w+-\d{3}$/, 'Invalid color format (e.g., bg-blue-500)').optional(),
})

// Post schemas
export const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(5, 'Slug must be at least 5 characters'),
  summary: z.string().max(300, 'Summary must be less than 300 characters').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  authorId: z.string(),
  categoryId: z.string(),
  tags: z.array(z.string()).optional(),
})

export const UpdatePostSchema = PostSchema.partial().extend({
  id: z.string(),
})

// Comment schemas
export const CommentSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(5, 'Comment must be at least 5 characters'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  authorId: z.string(),
  postId: z.string(),
})

export const UpdateCommentSchema = CommentSchema.partial().extend({
  id: z.string(),
})

// Tag schemas
export const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
})

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
export type LoginData = z.infer<typeof LoginSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>
export type Category = z.infer<typeof CategorySchema>
export type Post = z.infer<typeof PostSchema>
export type UpdatePost = z.infer<typeof UpdatePostSchema>
export type Comment = z.infer<typeof CommentSchema>
export type UpdateComment = z.infer<typeof UpdateCommentSchema>
export type Tag = z.infer<typeof TagSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
