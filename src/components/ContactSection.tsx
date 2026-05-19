'use client';

import { ContactFormData, contactSchema } from '@/lib/validations/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (!res.ok) {
        setError('root', {
          message: json.error || 'Failed to send message. Try again.'
        });
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setError('root', { message: 'Network error. Please try again.' });
    }
  };

  const fieldCls = (hasError: boolean) =>
    `w-full border rounded px-4 py-2.5 text-sm lg:text-base placeholder:text-gray-500 focus:outline-none focus:border-brand ${
      hasError ? 'border-red-400 bg-red-50' : 'border-gray-700'
    }`;

  return (
    <section className="mt-20 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Form card */}
        <div className="relative rounded-xl bg-white px-8 pt-16 pb-8 shadow-lg">
          {/* Person avatar floating above card */}
          <div className="absolute -top-14 left-1/2 z-10 flex -translate-x-1/2 justify-center md:-top-25">
            <div className="relative">
              {/* Green bar accent */}
              <div
                className="bg-brand absolute h-5"
                style={{
                  top: '55%',
                  right: '50%',
                  left: '-3rem',
                  transform: 'translateY(-50%)'
                }}
              />
              {/* Circle photo */}
              <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full md:h-46 md:w-46">
                <Image
                  src="/photo_mail.png"
                  alt="Contact person"
                  width={500}
                  height={330}
                  className="h-full w-full origin-[60%_30%] scale-180 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7 flex items-center gap-3">
            <div className="bg-brand flex h-14 w-14 shrink-0 items-center justify-center rounded-lg">
              <Image src="/mail.svg" alt="Mail icon" width={28} height={28} />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-semibold text-black uppercase lg:text-2xl">
                GET IN
              </p>
              <p className="text-xl font-bold text-gray-900 lg:text-2xl">
                TOUCH
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="py-8 text-center">
              <p className="text-brand text-lg font-semibold lg:text-xl">
                Message sent! ✓
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-brand mt-4 cursor-pointer text-sm underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-sm text-black lg:text-base"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  {...register('name')}
                  placeholder="type your name here..."
                  className={fieldCls(!!errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email + Telephone */}
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1 block text-sm text-black lg:text-base"
                  >
                    Email*
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    placeholder="example@example.com"
                    className={fieldCls(!!errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1 text-xs text-red-500"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact-telephone"
                    className="mb-1 block text-sm text-black lg:text-base"
                  >
                    Telephone*
                  </label>
                  <input
                    id="contact-telephone"
                    type="tel"
                    {...register('telephone')}
                    placeholder="( ) ___-____"
                    className={fieldCls(!!errors.telephone)}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block text-sm text-black lg:text-base"
                >
                  Message*
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  {...register('message')}
                  placeholder="Type what you want to say to us"
                  className={`${fieldCls(!!errors.message)} resize-none`}
                  aria-describedby={
                    errors.message ? 'message-error' : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Root / server error */}
              {errors.root && (
                <p role="alert" className="text-sm text-red-500">
                  {errors.root.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand hover:bg-brand-dark w-full cursor-pointer rounded py-3 text-sm font-bold tracking-wide text-white uppercase transition-colors disabled:opacity-60 lg:text-base"
              >
                {isSubmitting ? 'Sending...' : 'SEND NOW'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
