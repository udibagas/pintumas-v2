'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, LoginSchema, type RegisterData, type LoginData } from '@/lib/validations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  }) => void;
}

export default function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
  const [authError, setAuthError] = useState('');

  // React Hook Form for signin
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors, isSubmitting: isSignInSubmitting },
    reset: resetSignInForm,
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // React Hook Form for signup
  const {
    register,
    handleSubmit: handleSignUpSubmit,
    formState: { errors, isSubmitting },
    reset: resetSignUpForm,
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Authentication functions
  const handleSignIn = async (data: LoginData) => {
    setAuthError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        onAuthSuccess(response.data.user);
        onOpenChange(false);
        resetSignInForm();
      } else {
        setAuthError('Login failed. Please try again.');
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleSignUp = async (data: RegisterData) => {
    setAuthError('');

    try {
      const response = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        onAuthSuccess(response.data.user);
        onOpenChange(false);
        resetSignUpForm();
      } else {
        setAuthError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  const handleModalClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Reset forms when modal closes
      resetSignInForm();
      resetSignUpForm();
      setAuthError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selamat Datang di PintuMas</DialogTitle>
          <DialogDescription>
            Silakan masuk atau daftar untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Masuk</TabsTrigger>
            <TabsTrigger value="signup">Daftar</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignInSubmit(handleSignIn)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email Anda"
                  className={signInErrors.email ? 'border-red-300 focus:border-red-500' : ''}
                  {...registerSignIn('email')}
                />
                {signInErrors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {signInErrors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan Password Anda"
                  className={signInErrors.password ? 'border-red-300 focus:border-red-500' : ''}
                  {...registerSignIn('password')}
                />
                {signInErrors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {signInErrors.password.message}
                  </p>
                )}
              </div>

              {authError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isSignInSubmitting}
              >
                {isSignInSubmitting ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
              <p>Masukkan email dan password yang valid untuk masuk</p>
            </div>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUpSubmit(handleSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Masukkan alamat email Anda"
                  className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Buat password (minimal 6 karakter)"
                  className={errors.password ? 'border-red-300 focus:border-red-500' : ''}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Konfirmasi password Anda"
                  className={errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {authError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Membuat Akun...' : 'Daftar'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
              <p>Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
