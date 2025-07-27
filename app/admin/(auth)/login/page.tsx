'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoginSchema } from '@/lib/validations'
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate form data
      const validatedData = LoginSchema.parse(formData)

      const response = await axios.post('/api/auth/login', validatedData, {
        withCredentials: true,
      })

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred during login'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding/Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Image src="/images/pintumas.png" alt="PINTUMAS Logo" width={40} height={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">PINTUMAS</h1>
            <p className="text-xl text-amber-100 mb-8">Dashboard Administratif</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Akses Aman</h3>
                <p className="text-amber-100">Keamanan tingkat enterprise untuk panel admin Anda</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <LogIn className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Manajemen Mudah</h3>
                <p className="text-amber-100">Antarmuka yang efisien untuk administrasi yang mudah</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-sm text-amber-200">
              © 2025 PINTUMAS. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-600 rounded-full mb-4 shadow-lg">
              <Image src="/images/pintumas.png" alt="PINTUMAS Logo" width={32} height={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">PINTUMAS</h1>
            <p className="text-sm text-gray-600">Dashboard Administratif</p>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</CardTitle>
              <CardDescription className="text-gray-600">
                Masuk untuk mengakses dashboard admin
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Alamat Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@pintumas.com"
                    className="h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Masukkan kata sandi Anda"
                      className="h-12 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sedang masuk...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Masuk ke Dashboard
                    </>
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Akses admin yang aman</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Footer */}
          <div className="lg:hidden mt-8 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} PINTUMAS. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
