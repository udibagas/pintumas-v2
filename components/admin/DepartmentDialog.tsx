'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';
import { Department } from '@prisma/client';

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
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    link: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        slug: department.slug,
        link: department.link || '',
      });
      setPreviewImage(department.imageUrl || '');
    } else {
      setFormData({ name: '', slug: '', link: '' });
      setPreviewImage('');
    }
    setSelectedFile(null);
  }, [department, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !department) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = department?.imageUrl || '';

      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadFile(selectedFile);
        setUploading(false);
      }

      const data = {
        ...formData,
        imageUrl: imageUrl || null,
      };

      if (department) {
        await axios.put(`/api/admin/departments/${department.id}`, data);
        toast.success('Department updated successfully!');
      } else {
        await axios.post('/api/admin/departments', data);
        toast.success('Department created successfully!');
      }

      handleOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${department ? 'update' : 'create'} department`);
    } finally {
      setLoading(false);
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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Department name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="department-slug"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">External Link (Optional)</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo (Optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="mt-2">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? 'Uploading...' : loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
