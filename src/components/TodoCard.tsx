import { ReactNode } from 'react';

interface TodoCardProps {
  accentClass: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  showEraseAll?: boolean;
  onEraseAll?: () => void;
}

export default function TodoCard({
  accentClass,
  title,
  subtitle,
  children,
  showEraseAll = true,
  onEraseAll
}: TodoCardProps) {
  return (
    <div className="flex flex-col bg-white shadow-xl">
      <div className={`${accentClass} h-2`} />
      <div className="flex flex-1 flex-col px-6 pt-6 pb-8">
        <h3 className="text-center text-2xl font-bold text-gray-900 lg:text-3xl">
          {title}
        </h3>
        {subtitle && <div className="mt-1 mb-5">{subtitle}</div>}
        {children}
        {showEraseAll && (
          <button
            onClick={onEraseAll}
            className={[
              'mt-6 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white lg:text-base',
              onEraseAll
                ? 'cursor-pointer transition-colors hover:bg-gray-900'
                : 'cursor-default'
            ].join(' ')}
          >
            erase all
          </button>
        )}
      </div>
    </div>
  );
}
