/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from '@/context/AuthContext';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  const handleGoToList = () => {
    if (user) {
      router.push('/todos');
    } else {
      openLoginModal('login', '/todos');
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pt-[1%]">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* Left: text */}
          <div className="relative z-10 flex flex-col items-center justify-center md:ml-[15%] md:items-start lg:pb-0">
            <h1 className="leading-none">
              <span className="block text-5xl font-bold text-gray-900 sm:text-6xl xl:text-7xl 2xl:text-8xl">
                Organize
              </span>
              <span className="text-brand mt-2 block text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl">
                your daily jobs
              </span>
            </h1>

            <p className="mt-12 text-sm font-semibold text-gray-900 sm:text-base lg:text-xl xl:text-2xl 2xl:text-3xl">
              The only way to get things done
            </p>

            <div className="mt-14">
              <button
                onClick={handleGoToList}
                className="bg-brand hover:bg-brand-dark inline-block cursor-pointer rounded-lg px-20 py-5 text-base font-semibold text-white transition-colors lg:text-lg xl:text-xl 2xl:text-2xl"
              >
                Go to To-do list
              </button>
            </div>
          </div>

          {/* Right: decorative */}
          <div className="relative hidden lg:block">
            <img
              src="/coopers_logo.svg"
              alt="Coopers"
              className="pointer-events-none absolute top-0 -right-16 z-10 h-full w-full object-contain select-none"
              draggable={false}
            />

            {/* Room photo */}
            <div className="absolute top-1/2 right-[15%] z-20 aspect-square h-[60%] -translate-y-1/2">
              <Image
                src="/room.png"
                alt="Organized workspace"
                className="pointer-events-none h-full w-full object-contain select-none"
                width={700}
                height={700}
                loading="eager"
                draggable={false}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ArrowDown size={28} stroke="#9ca3af" strokeWidth={2} />
      </div>
    </section>
  );
}
