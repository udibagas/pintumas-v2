"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import type { Apps } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, "App name is required"),
  iconUrl: z.string().min(1, "Icon is required"),
  link: z.string().url("Please enter a valid URL").min(1, "Link is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AppDialogProps {
  app?: Apps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
}

export function AppDialog({ app, open, onOpenChange, onSubmit }: AppDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      iconUrl: "",
      link: "",
    },
  });

  // Reset form when app or dialog state changes
  useEffect(() => {
    if (open) {
      if (app) {
        form.reset({
          name: app.name,
          iconUrl: app.iconUrl || "",
          link: app.link || "",
        });
        setPreviewImage(app.iconUrl || '');
      } else {
        form.reset({
          name: "",
          iconUrl: "",
          link: "",
        });
        setPreviewImage('');
      }
      setSelectedFile(null);
    }
  }, [app, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      // Set a temporary value to satisfy form validation
      form.setValue('iconUrl', 'uploading');
      form.clearErrors('iconUrl');

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

  const handleSubmit = async (data: FormValues) => {
    // Validate that we have either a file selected or existing iconUrl
    if (!selectedFile && !app?.iconUrl) {
      form.setError('iconUrl', { message: 'Icon is required' });
      return;
    }

    setIsSubmitting(true);
    setUploading(true);
    try {
      let iconUrl = data.iconUrl;

      // Upload file if selected
      if (selectedFile) {
        iconUrl = await uploadFile(selectedFile);
      } else if (app?.iconUrl) {
        // Keep existing icon if editing and no new file selected
        iconUrl = app.iconUrl;
      }

      await onSubmit({
        ...data,
        iconUrl,
      });

      form.reset();
      setPreviewImage('');
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{app ? "Edit App" : "Add New App"}</DialogTitle>
          <DialogDescription>
            {app ? "Update the app information." : "Add a new app to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter app name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="icon">Icon *</Label>
              <Input
                id="icon"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {form.formState.errors.iconUrl && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.iconUrl.message}
                </p>
              )}
              {previewImage && (
                <div className="mt-2 space-y-2">
                  <div className="relative inline-block">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => {
                        setPreviewImage('');
                        setSelectedFile(null);
                        form.setValue('iconUrl', '');
                        const fileInput = document.getElementById('icon') as HTMLInputElement;
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

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || uploading}>
                {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (app ? "Update" : "Create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
