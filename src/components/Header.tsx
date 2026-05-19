'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const { user, isLoading, openLoginModal, logout } = useAuth();

  return (
    <header className="absolute top-[5%] right-0 left-0 z-40 md:mx-[5%]">
      <div className="flex h-16 items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/coopers_logo.svg"
            alt="Coopers"
            width={26}
            height={30}
            priority
            className="mt-1 h-6 w-auto lg:h-8 xl:h-9 2xl:h-12"
          />
          <span className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl xl:text-4xl 2xl:text-5xl">
            coopers
          </span>
        </Link>

        {!isLoading && (
          <>
            {user ? (
              <div className="flex items-center gap-4">
                {pathname !== '/todos' && (
                  <Link
                    href="/todos"
                    className="text-brand hidden text-sm font-medium hover:underline sm:block lg:text-base"
                  >
                    my tasks
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="cursor-pointer bg-black px-10 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 lg:text-base"
                >
                  sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('login', '/todos')}
                className="cursor-pointer bg-black px-10 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 lg:text-base"
              >
                entrar
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
