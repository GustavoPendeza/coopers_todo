'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const CARDS = [
  {
    id: 1,
    image: '/slider1.png',
    category: 'function',
    title: 'Organize your daily job enhance your life performance',
    link: 'read more'
  },
  {
    id: 2,
    image: '/slider2.png',
    category: 'function',
    title:
      'Mark one activity as done makes your brain understands the power of doing.',
    link: 'read more'
  },
  {
    id: 3,
    image: '/slider3.png',
    category: 'function',
    title:
      'Careful with missunderstanding the difference between a list of things and a list of desires.',
    link: 'read more'
  },
  {
    id: 4,
    image: '/slider3.png',
    category: 'function',
    title:
      'Careful with missunderstanding the difference between a list of things and a list of desires.',
    link: 'read more'
  },
  {
    id: 5,
    image: '/slider2.png',
    category: 'function',
    title:
      'Mark one activity as done makes your brain understands the power of doing.',
    link: 'read more'
  },
  {
    id: 6,
    image: '/slider1.png',
    category: 'function',
    title: 'Organize your daily job enhance your life performance',
    link: 'read more'
  },
  {
    id: 7,
    image: '/slider2.png',
    category: 'function',
    title:
      'Mark one activity as done makes your brain understands the power of doing.',
    link: 'read more'
  },
  {
    id: 8,
    image: '/slider1.png',
    category: 'function',
    title: 'Organize your daily job enhance your life performance',
    link: 'read more'
  },
  {
    id: 9,
    image: '/slider3.png',
    category: 'function',
    title:
      'Careful with missunderstanding the difference between a list of things and a list of desires.',
    link: 'read more'
  }
];

const DRAG_THRESHOLD = 60;

export default function GoodThings() {
  const [currentPage, setCurrentPage] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const startX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardsPerPage = isMobile ? 1 : 3;
  const pageCount = Math.ceil(CARDS.length / cardsPerPage);

  useEffect(() => {
    async function reset() {
      setCurrentPage(0);
    }
    void reset();
  }, [isMobile]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, Math.min(pageCount - 1, page)));
  };

  const onDragStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    setDragX(clientX - startX.current);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX < -DRAG_THRESHOLD) goToPage(currentPage + 1);
    else if (dragX > DRAG_THRESHOLD) goToPage(currentPage - 1);
    setDragX(0);
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <div className="bg-brand h-130 rounded-2xl pt-10 pl-10 md:relative md:mr-20 md:pt-20 md:pl-20">
          <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            good things
          </h2>

          {/* Viewport — clips the track */}
          <div className="absolute z-20 w-full max-md:right-0 max-md:left-0 max-md:px-2 md:-bottom-20">
            <div
              className="-mx-4 -my-3 cursor-grab overflow-hidden px-4 py-3 select-none active:cursor-grabbing"
              onMouseDown={(e) => onDragStart(e.clientX)}
              onMouseMove={(e) => onDragMove(e.clientX)}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => {
                e.preventDefault();
                onDragMove(e.touches[0].clientX);
              }}
              onTouchEnd={onDragEnd}
            >
              {/* Track — all pages side by side */}
              <div
                className="flex gap-8 pb-2"
                style={{
                  transform: `translateX(calc(${currentPage} * (-100% - 32px) + ${dragX}px))`,
                  transition: isDragging ? 'none' : 'transform 0.4s ease'
                }}
              >
                {Array.from({ length: pageCount }).map((_, pageIdx) => {
                  const pageCards = CARDS.slice(
                    pageIdx * cardsPerPage,
                    (pageIdx + 1) * cardsPerPage
                  );
                  return (
                    <div
                      key={pageIdx}
                      className="grid w-full shrink-0 grid-cols-1 gap-5 sm:grid-cols-3 sm:px-3"
                    >
                      {pageCards.map((card) => (
                        <article
                          key={card.id}
                          className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg"
                        >
                          {/* Image */}
                          <div className="relative h-52 overflow-hidden rounded-t-2xl">
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={430}
                              height={300}
                              className="h-full w-full origin-bottom-left scale-125 object-cover object-bottom-left"
                              draggable={false}
                            />
                          </div>

                          {/* Content */}
                          <div className="relative flex flex-1 flex-col px-5 pt-6 pb-5">
                            <Image
                              src="/coopers_logo.svg"
                              alt="Coopers Logo"
                              width={100}
                              height={50}
                              className="absolute -top-6.5 right-3 z-10 w-11"
                              draggable={false}
                            />
                            <span className="mb-3 inline-block self-start rounded-full border border-gray-300 px-3 py-0.5 text-xs text-gray-500 lg:text-sm">
                              {card.category}
                            </span>
                            <p className="flex-1 text-sm leading-snug font-semibold text-gray-900 lg:text-base">
                              {card.title}
                            </p>
                            <button className="text-brand mt-8 cursor-pointer text-left text-sm font-semibold hover:underline lg:text-base">
                              {card.link}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-4 md:mt-30">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={[
                'h-6 w-6 cursor-pointer rounded-full transition-all',
                i === currentPage
                  ? 'bg-brand scale-110 ring-2 ring-white'
                  : 'bg-gray-300'
              ].join(' ')}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
