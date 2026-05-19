'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TodoSection from '@/components/TodoSection';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TodosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="bg-section-dark flex min-h-screen items-center justify-center">
        <div className="border-brand h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <TodoSection />
      </main>
      <Footer />
    </>
  );
}
