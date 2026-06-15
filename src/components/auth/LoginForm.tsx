'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Lock, Mail } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { loginSchema, LoginSchemaType } from '@/schemas/login.schema';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authService } from '@/services/auth.service';
import { LoginRequest, ApiError } from '@/types/auth.types';

const SOCIAL_BUTTON_CLASS =
  'flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--text)] bg-white text-sm font-medium transition-colors hover:border-[var(--primary)] text-[var(--text)]';

/* Decode JWT payload and extract user info including role.
   Handles common Spring Boot JWT claim shapes:
     { roles: ["ROLE_RIDER"], sub: "email@..." }
     { authorities: [{authority: "ROLE_RIDER"}], sub: "email@..." }
     { role: "ROLE_RIDER", sub: "email@..." }
*/
function decodeUserFromJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const seg = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = seg + '='.repeat((4 - (seg.length % 4)) % 4);
    const claims = JSON.parse(window.atob(padded)) as Record<string, unknown>;

    const role: string =
      (Array.isArray(claims.roles) ? String(claims.roles[0]) : '') ||
      (Array.isArray(claims.authorities)
        ? String(
            (claims.authorities as Array<{ authority?: string }>)[0]
              ?.authority || claims.authorities[0],
          )
        : '') ||
      String(claims.role || claims.scope || 'ROLE_PASSENGER');

    const email = String(claims.sub || claims.email || '');
    const firstName = String(
      claims.firstName || claims.given_name || email.split('@')[0] || 'User',
    );

    return {
      id: String(claims.sub || claims.userId || claims.id || ''),
      firstName,
      lastName: String(claims.lastName || claims.family_name || ''),
      email,
      role,
    };
  } catch {
    return null;
  }
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { role: 'ROLE_PASSENGER' },
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setErrorMessage('');

      // Clear any stale tokens before login so axios interceptor doesn't
      // attach an old/broken token to the login request itself.
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.localStorage.removeItem('user');

      const payload: LoginRequest = {
        email: data.email.trim(),
        password: data.password,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawResponse: any = await authService.login(payload);

      // Backend may return a plain JWT string OR an object
      const accessToken: string =
        typeof rawResponse === 'string'
          ? rawResponse
          : rawResponse.accessToken || '';

      const refreshToken: string =
        typeof rawResponse === 'string' ? '' : rawResponse.refreshToken || '';

      window.localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        window.localStorage.setItem('refreshToken', refreshToken);
      }

      // Build user object: prefer response.user then fall back to JWT claims
      let userObj =
        typeof rawResponse === 'object' && rawResponse !== null
          ? rawResponse.user || null
          : null;

      if (!userObj || !userObj.role) {
        const fromJwt = decodeUserFromJwt(accessToken);
        if (fromJwt) {
          userObj = userObj
            ? Object.assign({}, fromJwt, userObj, {
                role: (userObj.role as string) || fromJwt.role,
              })
            : fromJwt;
        }
      }

      if (userObj) {
        window.localStorage.setItem('user', JSON.stringify(userObj));
      }

      router.push('/dashboard/overview');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white p-5 sm:p-6 lg:rounded-3xl lg:p-8 lg:shadow-sm">
      <header>
        <h1 className="text-3xl font-bold text-[var(--heading)] sm:text-4xl">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Sign in to continue your journey
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          required
          label="Email Address"
          placeholder="Enter your email address"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          required
          type="password"
          label="Password"
          placeholder="Enter your password"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        {errorMessage && (
          <p className="text-sm font-medium text-[var(--error)]">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            Forgot Password?
          </button>
        </div>

        <Button disabled={!isValid} isLoading={isSubmitting}>
          Continue Journey
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs font-medium text-[var(--text)]">OR</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <button type="button" className={SOCIAL_BUTTON_CLASS}>
          <Globe size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-[var(--text)]">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
