import { Check } from 'lucide-react';
import Image from 'next/image';
import TodoCard from './TodoCard';

const TODO_ITEMS = [
  { id: 1, text: 'this is a new task', highlighted: true },
  { id: 2, text: 'Develop the To-do list page' },
  { id: 3, text: 'Create the drag-and-drop function' },
  { id: 4, text: 'Add new tasks' },
  { id: 5, text: 'Delete items' },
  { id: 6, text: 'Erase all' },
  { id: 7, text: 'Checked item goes to Done list' },
  { id: 8, text: 'This item label may be edited', showDelete: true },
  { id: 9, text: 'Editing an item...', editing: true }
];

const DONE_ITEMS = [
  { id: 10, text: 'Get FTP credentials', showDelete: true },
  { id: 11, text: 'Home Page Design' },
  { id: 12, text: 'E-mail John about the deadline' },
  { id: 13, text: 'Create a Google Drive folder' },
  { id: 14, text: 'Send a gift to the client' }
];

export default function StaticTodoSection() {
  return (
    <section id="todo-list" className="relative -top-10 bg-white">
      {/* Black title band with diagonal top edge */}
      <div
        className="bg-black px-4 text-center"
        style={{
          clipPath: 'polygon(0 120px, 100% 0, 100% calc(100% - 120px), 0 100%)',
          paddingTop: 'calc(120px + 3.5rem)',
          paddingBottom: 'calc(120px + 3.5rem)'
        }}
      >
        <h2 className="relative inline-block text-4xl font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          To-do List
          <span className="bg-brand absolute right-0 -bottom-2 left-0 h-1" />
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white sm:text-base md:mt-12 lg:text-lg xl:text-xl 2xl:text-2xl">
          Drag and drop to set your main priorities, check
          <br className="hidden sm:block" /> when done and create what&apos;s
          new.
        </p>
      </div>

      {/* Cards */}
      <div className="relative px-4 pt-12 pb-16 md:px-0">
        {/* Decorative green triangle */}
        <Image
          src="/triangle.svg"
          alt="Decorative triangle"
          className="absolute hidden md:block"
          width={120}
          height={160}
        />

        <div className="mx-auto grid max-w-3xl grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* To-do card */}
          <TodoCard
            accentClass="bg-todo-orange"
            title="To-do"
            subtitle={
              <p className="text-center text-sm text-gray-500 lg:text-base">
                Take a breath.
                <br />
                Start doing.
              </p>
            }
          >
            <div className="flex-1 space-y-1">
              {TODO_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-1.5">
                  {item.highlighted ? (
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-500 bg-white">
                      <Check size={12} strokeWidth={3} color="#4ac959" />
                    </div>
                  ) : (
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-amber-500" />
                  )}
                  <span
                    className={[
                      'min-w-0 flex-1 text-sm leading-snug wrap-break-word lg:text-base',
                      item.editing ? 'text-[#E38D3F]' : '',
                      item.highlighted ? 'font-bold text-gray-900' : ''
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {item.text}
                  </span>
                  {item.showDelete && (
                    <span className="shrink-0 text-xs text-gray-400">
                      delete
                    </span>
                  )}
                </div>
              ))}
            </div>
          </TodoCard>

          {/* Done card */}
          <TodoCard
            accentClass="bg-brand"
            title="Done"
            subtitle={
              <>
                <p className="text-center text-sm text-gray-500 lg:text-base">
                  Congratulations!
                </p>
                <p className="text-center text-sm font-bold text-gray-900 lg:text-base">
                  You have done {DONE_ITEMS.length} tasks
                </p>
              </>
            }
          >
            <div className="flex-1 space-y-1">
              {DONE_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-1.5">
                  <div className="bg-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                    <Check size={12} strokeWidth={3} color="white" />
                  </div>
                  <span className="min-w-0 flex-1 text-sm leading-snug wrap-break-word text-gray-700 lg:text-base">
                    {item.text}
                  </span>
                  {item.showDelete && (
                    <span className="text-xs text-gray-400">delete</span>
                  )}
                </div>
              ))}
            </div>
          </TodoCard>
        </div>
      </div>
    </section>
  );
}
