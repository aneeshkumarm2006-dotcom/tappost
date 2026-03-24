'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-md">
      {/* Card */}
      <div className="border-2 border-white/10 bg-[#111111] p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-display text-3xl text-white">
            TAP<span className="text-[#B5FF4D]">POST</span>
            <span className="inline-block w-2 h-2 bg-[#B5FF4D] ml-1 align-middle" />
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl text-white mb-2">WELCOME BACK.</h1>
        <p className="font-mono-custom text-white/40 text-sm mb-8">
          Sign in to your TapPost account.
        </p>

        {/* Error State */}
        {error && (
          <div className="border-l-4 border-[#FF3B30] bg-[#FF3B30]/5 px-4 py-3 mb-6">
            <p className="font-mono-custom text-sm text-[#FF3B30]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourbar.com"
              className="
                w-full border-2 border-white/20 bg-black text-white
                font-mono-custom text-sm px-4 py-3
                placeholder:text-white/20
                focus:border-[#B5FF4D] focus:outline-none
                transition-colors duration-150
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full border-2 border-white/20 bg-black text-white
                  font-mono-custom text-sm px-4 py-3 pr-12
                  placeholder:text-white/20
                  focus:border-[#B5FF4D] focus:outline-none
                  transition-colors duration-150
                "
              />
              <button
                type="button"
                id="login-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <span className="font-mono-custom text-xs text-white/30 hover:text-[#B5FF4D] transition-colors cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="
              cta-btn w-full bg-[#B5FF4D] text-black
              font-display text-2xl py-3
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-150
            "
          >
            <span>{loading ? 'SIGNING IN...' : 'SIGN IN →'}</span>
          </button>
        </form>

        {/* Signup link */}
        <p className="font-mono-custom text-sm text-white/40 text-center mt-8">
          No account?{' '}
          <Link
            href="/signup"
            id="login-signup-link"
            className="text-[#B5FF4D] hover:underline"
          >
            Start free →
          </Link>
        </p>
      </div>
    </main>
  );
}
