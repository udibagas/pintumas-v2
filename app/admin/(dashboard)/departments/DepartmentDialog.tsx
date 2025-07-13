'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';
import { generateSlug } from '@/lib/utils';

const departmentSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Slug cannot start or end with a hyphen'),
  link: z.string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'Please enter a valid URL'),
  imageUrl: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface Department {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentDialogProps {
  department?: Department;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DepartmentDialog({
  department,
  isOpen,
  handleOpenChange,
  onSuccess,
}: DepartmentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      slug: '',
      link: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        slug: department.slug,
        link: department.link || '',
        imageUrl: department.imageUrl || '',
      });
      setPreviewImage(department.imageUrl || '');
    } else {
      form.reset({
        name: '',
        slug: '',
        link: '',
        imageUrl: '',
      });
      setPreviewImage('');
    }
    setSelectedFile(null);
  }, [department, isOpen, form]);

  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!department) {
      form.setValue('slug', generateSlug(value));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.url;
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      let imageUrl = department?.imageUrl || '';

      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadFile(selectedFile);
        setUploading(false);
      }

      const submitData = {
        ...data,
        imageUrl: imageUrl || undefined,
      };

      if (department) {
        await axios.put(`/api/admin/departments/${department.id}`, submitData);
        toast.success('Department updated successfully!');
      } else {
        await axios.post('/api/admin/departments', submitData);
        toast.success('Department created successfully!');
      }

      handleOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${department ? 'update' : 'create'} department`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Edit Department' : 'Create Department'}
          </DialogTitle>
          <DialogDescription>
            {department ? 'Update the department details.' : 'Create a new department.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Department name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="department-slug"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="logo">Logo (Optional)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewImage && (
                <div className="mt-2 space-y-2">
                  <div className="relative inline-block">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => {
                        setPreviewImage('');
                        setSelectedFile(null);
                        const fileInput = document.getElementById('logo') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Click × to remove image</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
                {uploading ? 'Uploading...' : form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
