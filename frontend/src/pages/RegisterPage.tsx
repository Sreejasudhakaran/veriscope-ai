import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { api, endpoints } from '../services/api'

interface RegisterForm {
  name: string
  email: string
  password: string
  company?: string
}

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const response = await api.post(endpoints.auth.register, data)
      // backend returns { success: true, token, user }
      const token = response.data?.token
      const user = response.data?.user
      console.log('Register response:', response.data)
      if (token) {
        localStorage.setItem('authToken', token)
        if (user) localStorage.setItem('user', JSON.stringify(user))
        try {
          window.dispatchEvent(new Event('auth:changed'))
        } catch (e) {
          // ignore
        }
        toast.success('Registration successful!')
        navigate('/dashboard')
      } else {
        toast.error('Registration succeeded but no token returned')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.error || error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl leading-9 font-extrabold text-gray-900">Create an account</h2>
        <p className="mt-2 text-center text-sm leading-5 text-gray-600">
          Or <Link to="/login" className="text-primary-600">sign in to your account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input {...register('name', { required: 'Name is required' })} className="input-field" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input {...register('email', { required: 'Email is required' })} type="email" className="input-field" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input {...register('password', { required: 'Password is required', minLength: 6 })} type="password" className="input-field" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company (optional)</label>
              <input {...register('company')} className="input-field" />
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
