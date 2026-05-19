'use client';

import { useAuth } from '@/context/AuthContext';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical } from 'lucide-react';
import { KeyboardEvent as RKE, useEffect, useRef, useState } from 'react';
import TodoCard from './TodoCard';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  sort_order: number;
}

function SortableItem({
  todo,
  onToggle,
  onDelete,
  onUpdate
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditText(todo.text);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const t = editText.trim();
    if (t && t !== todo.text) onUpdate(todo.id, t);
    else setEditText(todo.text);
    setEditing(false);
  };

  const handleKey = (e: RKE<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-start gap-3 py-1.5"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 cursor-grab touch-none text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        aria-label="Drag"
      >
        <GripVertical size={16} />
      </button>

      <button
        onClick={() => onToggle(todo.id)}
        className="hover:border-brand mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-full border-2 border-amber-500 transition-colors"
        aria-label="Done"
      />

      {editing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKey}
          className="flex-1 border-b border-[#E38D3F] bg-transparent text-base text-[#E38D3F] outline-none"
        />
      ) : (
        <span
          onClick={startEdit}
          title="Click to edit"
          className="line-clamp-3 min-w-0 flex-1 cursor-text text-sm leading-snug wrap-break-word text-gray-700 lg:text-base"
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="mt-0.5 shrink-0 cursor-pointer text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
      >
        delete
      </button>
    </div>
  );
}

function DoneItem({
  todo,
  onToggle,
  onDelete
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="group flex items-start gap-3 py-1.5">
      <button
        onClick={() => onToggle(todo.id)}
        className="bg-brand hover:bg-brand-dark mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        aria-label="Undo"
      >
        <Check size={10} strokeWidth={3} color="white" />
      </button>
      <span className="line-clamp-3 min-w-0 flex-1 text-sm leading-snug wrap-break-word text-gray-500 line-through lg:text-base">
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="mt-0.5 shrink-0 cursor-pointer text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
      >
        delete
      </button>
    </div>
  );
}

export default function TodoSection() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [fetching, setFetching] = useState(false);

  const pending = todos
    .filter((t) => !t.completed)
    .sort((a, b) => a.sort_order - b.sort_order);
  const done = todos.filter((t) => t.completed);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setFetching(true);
      try {
        const r = await fetch('/api/v1/todos');
        const { todos: data } = await r.json();
        setTodos(data ?? []);
      } finally {
        setFetching(false);
      }
    }

    void load();
  }, [user]);

  const patch = (id: number, body: Partial<Todo>) =>
    fetch(`/api/v1/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

  const addTodo = async () => {
    if (!newTask.trim()) return;
    const res = await fetch('/api/v1/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTask.trim() })
    });
    const data = await res.json();
    if (data.todo) {
      setTodos((p) => [...p, data.todo]);
      setNewTask('');
    }
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id)!;
    setTodos((p) =>
      p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    patch(id, { completed: !todo.completed });
  };

  const deleteTodo = (id: number) => {
    setTodos((p) => p.filter((t) => t.id !== id));
    fetch(`/api/v1/todos/${id}`, { method: 'DELETE' });
  };

  const updateTodo = (id: number, text: string) => {
    setTodos((p) => p.map((t) => (t.id === id ? { ...t, text } : t)));
    patch(id, { text });
  };

  const eraseAll = (type: 'pending' | 'completed') => {
    setTodos((p) =>
      p.filter((t) => (type === 'pending' ? t.completed : !t.completed))
    );
    fetch(`/api/v1/todos?type=${type}`, { method: 'DELETE' });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 }
    })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oi = pending.findIndex((t) => t.id === active.id);
    const ni = pending.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(pending, oi, ni);
    setTodos([...reordered.map((t, i) => ({ ...t, sort_order: i })), ...done]);
    reordered.forEach((t, i) => {
      if (t.sort_order !== i) patch(t.id, { sort_order: i });
    });
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Title */}
      <div className="hidden px-4 py-14 text-center md:block">
        <h2 className="relative inline-block text-4xl font-bold text-black sm:text-5xl lg:text-6xl">
          To-do List
          <span className="bg-brand absolute right-0 -bottom-1.5 left-0 h-0.75" />
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-black sm:text-base lg:text-lg">
          Drag and drop to set your main priorities, check when done and create
          what&apos;s new.
        </p>
      </div>

      {/* Columns */}
      <div className="relative mt-32 md:mt-0 px-4 pb-16">
        {fetching ? (
          <div className="flex justify-center py-20">
            <div className="border-brand h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="mx-auto grid max-w-3xl grid-cols-1 items-start gap-6 md:grid-cols-2">
              {/* To-do card */}
              <TodoCard
                accentClass="bg-todo-orange"
                title="To-do"
                subtitle={
                  <p className="text-center text-sm text-black lg:text-base">
                    Take a breath.
                    <br />
                    Start doing.
                  </p>
                }
                showEraseAll={pending.length > 0}
                onEraseAll={() => eraseAll('pending')}
              >
                <div className="mb-4 flex gap-2 pb-4">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-500 bg-white">
                    <Check size={12} strokeWidth={3} color="#4ac959" />
                  </div>
                  <input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="add a new task here..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 lg:text-base"
                  />
                  <button
                    onClick={addTodo}
                    className="text-brand hover:text-brand-dark cursor-pointer text-xl leading-none"
                    aria-label="Add"
                  >
                    +
                  </button>
                </div>
                <div className="min-h-30 flex-1">
                  <SortableContext
                    items={pending.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {pending.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500">
                        No tasks yet. Add one above!
                      </p>
                    ) : (
                      pending.map((t) => (
                        <SortableItem
                          key={t.id}
                          todo={t}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onUpdate={updateTodo}
                        />
                      ))
                    )}
                  </SortableContext>
                </div>
              </TodoCard>

              {/* Done card */}
              {done.length > 0 ? (
                <TodoCard
                  accentClass="bg-brand"
                  title="Done"
                  subtitle={
                    <>
                      <p className="text-center text-sm text-gray-500 lg:text-base">
                        Congratulations!
                      </p>
                      <p className="text-center text-sm font-bold text-gray-900 lg:text-base">
                        You have done{' '}
                        <span className="text-brand">{done.length}</span>{' '}
                        {done.length === 1 ? 'task' : 'tasks'}
                      </p>
                    </>
                  }
                  showEraseAll
                  onEraseAll={() => eraseAll('completed')}
                >
                  <div className="flex-1 space-y-0.5">
                    {done.map((t) => (
                      <DoneItem
                        key={t.id}
                        todo={t}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </div>
                </TodoCard>
              ) : (
                <TodoCard
                  accentClass="bg-brand"
                  title="Done"
                  showEraseAll={false}
                >
                  <div className="flex flex-1 items-center justify-center py-10">
                    <p className="text-center text-sm text-gray-500">
                      No completed tasks yet.
                      <br />
                      Check items to move them here.
                    </p>
                  </div>
                </TodoCard>
              )}
            </div>
          </DndContext>
        )}
      </div>
    </section>
  );
}
