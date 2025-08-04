import { z } from "zod";

// User schemas
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
  avatar: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserSchema = UserSchema.omit({ password: true }).extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

// Category schemas
export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  color: z
    .string()
    .regex(/^bg-\w+-\d{3}$/, "Invalid color format (e.g., bg-blue-500)")
    .optional(),
});

// Post schemas
export const PostSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters")
    .max(255, "Slug must be less than 255 characters"),
  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  content: z.string().min(50, "Content must be at least 50 characters"),
  imageUrl: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  authorId: z.string().min(1, "Author is required"),
  departmentId: z.string().min(1, "Department is required"),
  appId: z.string().min(1, "App is required"),
  tagIds: z.array(z.string()).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

// Form schema for creating/editing posts (without server-only fields)
export const PostFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters")
    .max(255, "Slug must be less than 255 characters"),
  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters")
    .optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  departmentId: z.string().min(1, "Please select a department"),
  appId: z.string().min(1, "Please select an app"),
  tagIds: z.array(z.string()).optional(),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const UpdatePostSchema = PostSchema.partial().extend({
  id: z.string(),
});

// Comment schemas
export const CommentSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(5, "Comment must be at least 5 characters"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  authorId: z.string(),
  postId: z.string(),
});

export const UpdateCommentSchema = CommentSchema.partial().extend({
  id: z.string(),
});

// Tag schemas
export const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Tag name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
});

// Announcement schemas (separate from posts)
export const AnnouncementSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  summary: z
    .string()
    .max(500, "Summary must be less than 500 characters")
    .optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  announcementType: z
    .enum(["INFO", "BREAKING", "ALERT", "EVENT", "MAINTENANCE"])
    .default("INFO"),
  priority: z
    .number()
    .min(1, "Priority must be at least 1")
    .max(4, "Priority must be at most 4")
    .default(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  linkUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkText: z
    .string()
    .max(50, "Link text must be less than 50 characters")
    .optional(),
  categoryId: z.string().optional(), // Optional for announcements
});

export const UpdateAnnouncementSchema = AnnouncementSchema.partial();

// Legacy: Keep AnnouncementPostSchema for backward compatibility
export const AnnouncementPostSchema = AnnouncementSchema;

// Settings schemas
export const ContactInfoSchema = z.object({
  address: z.string().min(1, "Alamat wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid"),
  workingHours: z.string().optional(),
  fax: z.string().optional(),
});

export const SocialMediaSchema = z.object({
  facebook: z
    .string()
    .url("URL Facebook tidak valid")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("URL Twitter tidak valid")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("URL Instagram tidak valid")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("URL LinkedIn tidak valid")
    .optional()
    .or(z.literal("")),
  youtube: z
    .string()
    .url("URL YouTube tidak valid")
    .optional()
    .or(z.literal("")),
  tiktok: z.string().url("URL TikTok tidak valid").optional().or(z.literal("")),
});

export const SettingsSchema = z.object({
  contactInfo: ContactInfoSchema,
  socialMedia: SocialMediaSchema,
});

// Regulation schemas
export const RegulationSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  departmentId: z.string().optional().nullable(),
  attachmentUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export const RegulationFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(255, "Title must be less than 255 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  departmentId: z.string().optional(),
  attachmentUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const UpdateRegulationSchema = RegulationSchema.partial().extend({
  id: z.string(),
});

// App schemas
export const AppSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  iconUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  departmentIds: z
    .array(z.string())
    .min(1, "Please select at least one department"),
});

export const AppFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  iconUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  departmentIds: z
    .array(z.string())
    .min(1, "Please select at least one department"),
});

export const UpdateAppSchema = AppSchema.partial().extend({
  id: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostForm = z.infer<typeof PostFormSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type UpdateAnnouncement = z.infer<typeof UpdateAnnouncementSchema>;
export type AnnouncementPost = z.infer<typeof AnnouncementPostSchema>; // Legacy
export type UpdateAnnouncementPost = z.infer<typeof UpdateAnnouncementSchema>; // Legacy
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type Regulation = z.infer<typeof RegulationSchema>;
export type RegulationForm = z.infer<typeof RegulationFormSchema>;
export type UpdateRegulation = z.infer<typeof UpdateRegulationSchema>;
export type App = z.infer<typeof AppSchema>;
export type AppForm = z.infer<typeof AppFormSchema>;
export type UpdateApp = z.infer<typeof UpdateAppSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
