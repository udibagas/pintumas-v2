'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { UseCrudType } from '@/hooks/useCrud';
import { DepartmentData } from './types';
import Image from 'next/image';
import axios from 'axios';

const appSchema = z.object({
  name: z.string().min(1, 'Nama layanan diperlukan').max(100, 'Nama layanan harus kurang dari 100 karakter'),
  iconUrl: z.string().optional().or(z.literal('')),
  link: z.string().url('Silakan masukkan URL yang valid').optional().or(z.literal('')),
  description: z.string().max(500, 'Deskripsi harus kurang dari 500 karakter').optional().or(z.literal('')),
  departmentIds: z.array(z.string()).min(1, 'Silakan pilih setidaknya satu departemen'),
});

type AppFormData = z.infer<typeof appSchema>;

export default function AppDialog({ hook }: { hook: UseCrudType }) {
  const {
    modalOpen,
    setModalOpen,
    editingData: app,
    handleSubmit: onSubmit,
    isSubmitting,
    handleModalClose
  } = hook;

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: app?.name || '',
      iconUrl: app?.iconUrl || '',
      link: app?.link || '',
      description: app?.description || '',
      departmentIds: [],
    }
  });

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/admin/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const currentDepartmentIds = app?.DepartmentApps?.map((d: any) => d.department.id) || [];
    setSelectedDepartments(currentDepartmentIds);

    reset({
      name: app?.name || '',
      iconUrl: app?.iconUrl || '',
      link: app?.link || '',
      description: app?.description || '',
      departmentIds: currentDepartmentIds,
    });
    setPreviewImage(app?.iconUrl || '');
  }, [app, reset]);

  const isEdit = Boolean(app?.id);

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    let newSelectedDepartments;
    if (checked) {
      newSelectedDepartments = [...selectedDepartments, departmentId];
    } else {
      newSelectedDepartments = selectedDepartments.filter(id => id !== departmentId);
    }
    setSelectedDepartments(newSelectedDepartments);
    setValue('departmentIds', newSelectedDepartments);
  };

  const handleFormSubmit = async (data: AppFormData) => {
    try {
      const formData = {
        ...data,
        departmentIds: selectedDepartments,
      };
      await onSubmit(formData);
      reset();
      setSelectedFile(null);
      setPreviewImage('');
      setSelectedDepartments([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Upload file immediately
      try {
        setUploading(true);
        const uploadedUrl = await uploadFile(file);
        setValue('iconUrl', uploadedUrl);
        setPreviewImage(uploadedUrl); // Update to use the uploaded URL
        setSelectedFile(null); // Clear selected file since it's uploaded
      } catch (error) {
        console.error('Error uploading file:', error);
        // Revert preview on error
        setPreviewImage(app?.iconUrl || '');
        setSelectedFile(null);
      } finally {
        setUploading(false);
      }
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

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => {
      setModalOpen(open);
      if (!open) {
        handleModalClose();
        reset();
        setSelectedFile(null);
        setPreviewImage('');
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Layanan' : 'Buat Layanan Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update informasi layanan' : 'Tambahkan layanan baru'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" id="app-form">
          {/* Hidden input for iconUrl */}
          <input type="hidden" {...register('iconUrl')} />

          <div className="space-y-2">
            <Label htmlFor="name">Nama Layanan *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nama Layanan"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Logo *</Label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded object-cover border"
                />
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className={errors.iconUrl ? 'border-red-500' : ''}
                />
                {errors.iconUrl && (
                  <p className="text-sm text-red-500">{errors.iconUrl.message}</p>
                )}
                {uploading ? (
                  <p className="text-sm text-blue-600 mt-1">
                    Mengunggah logo...
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Unggah logo untuk layanan (PNG, JPG, atau GIF)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              {...register('link')}
              placeholder="https://example.com"
              className={errors.link ? 'border-red-500' : ''}
            />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Keterangan</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the app"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Instansi Terkait *</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-3 space-y-2">
              {departments.map((department) => (
                <div key={department.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${department.id}`}
                    checked={selectedDepartments.includes(department.id)}
                    onCheckedChange={(checked) =>
                      handleDepartmentChange(department.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`dept-${department.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {department.name}
                  </Label>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-sm text-gray-500">Tidak ada instansi tersedia</p>
              )}
            </div>
            {errors.departmentIds && (
              <p className="text-sm text-red-500">{errors.departmentIds.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleModalClose()}>Batal</Button>
          </DialogClose>
          <Button type="submit" form='app-form' disabled={isSubmitting || uploading}>
            {isSubmitting ? 'Menyimpan...' : uploading ? 'Mengunggah...' : 'Simpan Layanan'}
          </Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  );
}
