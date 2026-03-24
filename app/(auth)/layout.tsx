import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center px-4">
      {children}
    </div>
  );
}
