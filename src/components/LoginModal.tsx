'use client';

import { useAuth } from '@/context/AuthContext';
import { AuthFormData, authSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginModal() {
  const {
    showLoginModal,
    loginMode,
    closeLoginModal,
    login,
    register: registerUser,
    openLoginModal
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  useEffect(() => {
    reset();
  }, [loginMode, showLoginModal, reset]);

  /* Close on Esc */
  useEffect(() => {
    if (!showLoginModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLoginModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showLoginModal, closeLoginModal]);

  if (!showLoginModal) return null;

  const isLogin = loginMode === 'login';

  const onSubmit = async (data: AuthFormData) => {
    const result = isLogin
      ? await login(data.username, data.password)
      : await registerUser(data.username, data.password);

    if (result.error) {
      setError('root', { message: result.error });
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full border px-3 py-2 text-sm focus:outline-none focus:border-brand rounded-md ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={closeLoginModal}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden bg-white p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeLoginModal}
          className="hover:text-brand absolute top-3 right-4 z-10 cursor-pointer text-lg leading-none font-bold text-black"
          aria-label="Close"
        >
          close
        </button>

        <div className="flex flex-col">
          {/* Illustration */}
          <div className="items-center justify-center md:grid md:grid-cols-3">
            <div className="hidden md:block">
              <Image
                src="/login.svg"
                alt="Login"
                width={140}
                height={140}
                className="object-contain"
              />
            </div>

            <div className="col-span-2">
              <h2 className="text-3xl leading-tight font-bold text-gray-900 lg:text-4xl xl:text-5xl 2xl:text-6xl">
                {isLogin ? 'Sign in' : 'Sign up'}
              </h2>
              <p className="text-brand mb-8 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                {isLogin ? 'to access your list' : 'create your account'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col items-center mt-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-base font-semibold text-black"
                >
                  User:
                </label>
                <input
                  id="username"
                  type="text"
                  autoFocus
                  autoComplete="username"
                  {...register('username')}
                  className={fieldClass(!!errors.username)}
                  aria-describedby={
                    errors.username ? 'username-error' : undefined
                  }
                />
                {errors.username && (
                  <p
                    id="username-error"
                    role="alert"
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-base font-semibold text-black"
                >
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  {...register('password')}
                  className={fieldClass(!!errors.password)}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                />
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Root / server error */}
              {errors.root && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.root.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand hover:bg-brand-dark w-full cursor-pointer py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Loading...'
                  : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => openLoginModal(isLogin ? 'register' : 'login')}
                className="text-brand cursor-pointer font-medium hover:underline"
              >
                {isLogin ? 'Register here' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
