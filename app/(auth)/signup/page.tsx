'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const [barName, setBarName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!barName.trim()) {
      setError('Bar name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Create account via API
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barName: barName.trim(),
          email: email.trim().toLowerCase(),
          password,
          city: city.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please log in manually.');
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
    <main className="w-full max-w-md py-8">
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
        <h1 className="font-display text-5xl text-white mb-1">START FOR FREE.</h1>
        <p className="font-mono-custom text-[#B5FF4D] text-sm mb-8">
          7 days free. No credit card required.
        </p>

        {/* Error State */}
        {error && (
          <div className="border-l-4 border-[#FF3B30] bg-[#FF3B30]/5 px-4 py-3 mb-6">
            <p className="font-mono-custom text-sm text-[#FF3B30]">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Bar Name */}
          <div>
            <label
              htmlFor="signup-bar-name"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Bar Name
            </label>
            <input
              id="signup-bar-name"
              type="text"
              required
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
              placeholder="e.g. The Crown & Anchor"
              className="
                w-full border-2 border-white/20 bg-black text-white
                font-mono-custom text-sm px-4 py-3
                placeholder:text-white/20
                focus:border-[#B5FF4D] focus:outline-none
                transition-colors duration-150
              "
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="signup-email"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Email
            </label>
            <input
              id="signup-email"
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

          {/* City */}
          <div>
            <label
              htmlFor="signup-city"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              City
            </label>
            <input
              id="signup-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Melbourne"
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
              htmlFor="signup-password"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
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
                id="signup-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
                id="signup-confirm-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Trial Badge */}
          <div className="flex justify-center pt-2">
            <span className="bg-[#B5FF4D] text-black font-mono-custom text-xs px-4 py-2 tracking-widest">
              ✦ 7-DAY FREE TRIAL — NO CREDIT CARD
            </span>
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="
              cta-btn w-full bg-[#B5FF4D] text-black
              font-display text-2xl py-3
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-150
            "
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'START FOR FREE →'}</span>
          </button>
        </form>

        {/* Terms */}
        <p className="font-mono-custom text-[10px] text-white/20 text-center mt-4">
          By signing up you agree to our Terms &amp; Privacy Policy.
        </p>

        {/* Login link */}
        <p className="font-mono-custom text-sm text-white/40 text-center mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            id="signup-login-link"
            className="text-[#B5FF4D] hover:underline"
          >
            Login →
          </Link>
        </p>
      </div>
    </main>
  );
}
