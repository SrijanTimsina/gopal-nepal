'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Loader2,
  Send,
  CheckCircle,
  User,
  Mail,
  MessageSquare,
  FileText,
  Phone,
} from 'lucide-react';
import SocialLinks from './social-links';
import Link from 'next/link';

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters.' }),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number.' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function ContactForm({
  title = 'Get in Touch',
  description = "Have a question or want to connect? Fill out the form below and I'll get back to you as soon as possible.",
  className = '',
}: ContactFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formSpreeId = 'meoorbdj';

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`https://formspree.io/f/${formSpreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again later.');
      }

      setIsSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={`pb-24 pt-8 xl:py-24 ${className}`}>
      <div className="container mx-auto px-3">
        <div className="relative mx-auto max-w-6xl">
          <div className="absolute -left-1 -top-1 h-20 w-20 rounded-tl-2xl border-l-4 border-t-4 border-primary opacity-80 xl:-left-10 xl:-top-10"></div>
          <div className="absolute -bottom-1 -right-1 h-20 w-20 rounded-br-2xl border-b-4 border-r-4 border-primary opacity-80 xl:-bottom-10 xl:-right-10"></div>

          <div className="overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="grid grid-cols-1 xl:grid-cols-5">
              <div className="relative overflow-hidden bg-navy px-6 py-8 text-white lg:col-span-2 lg:p-12">
                <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-gold/10"></div>
                <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-gold/20"></div>

                <div className="relative z-10">
                  <h2 className="mb-6 text-3xl font-bold">{title}</h2>
                  <p className="mb-8 text-white/80">{description}</p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-navy-light rounded-full p-3">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">Email</h3>

                        <Link
                          href="mailto:gnepal41@gmail.com"
                          className="text-white/80 transition-all duration-300 hover:text-white"
                        >
                          gnepal41@gmail.com
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-navy-light rounded-full p-3">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">Contact</h3>
                        <Link
                          href="tel:+977-9849665172"
                          className="text-white/80 transition-all duration-300 hover:text-white"
                        >
                          9849665172
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-navy-light rounded-full p-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">
                          Social Media
                        </h3>
                        <SocialLinks className="pt-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-8 lg:col-span-3 lg:p-12">
                {isSubmitted ? (
                  <div className="flex h-full flex-col items-center justify-center py-12">
                    <div className="mb-6 rounded-full bg-green-50 p-4 text-green-600">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">Thank You!</h3>
                    <p className="mb-8 max-w-md text-center text-gray-600">
                      Your message has been sent successfully. I will get back
                      to you as soon as possible.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-navy text-white hover:bg-navy/90"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700">
                                Name
                              </FormLabel>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder="Your name"
                                    className="border-gray-300 pl-10 focus:border-navy focus:ring-navy"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700">
                                Email
                              </FormLabel>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder="Your email address"
                                    className="border-gray-300 pl-10 focus:border-navy focus:ring-navy"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700">
                                Phone Number
                              </FormLabel>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder="Your phone number"
                                    className="border-gray-300 pl-10 focus:border-navy focus:ring-navy"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium text-gray-700">
                                Subject
                              </FormLabel>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <FormControl>
                                  <Input
                                    placeholder="What is this regarding?"
                                    className="border-gray-300 pl-10 focus:border-navy focus:ring-navy"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700">
                              Message
                            </FormLabel>
                            <div className="relative">
                              <div className="pointer-events-none absolute left-3 top-3">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                              </div>
                              <FormControl>
                                <Textarea
                                  placeholder="Your message"
                                  className="min-h-[150px] border-gray-300 pl-10 focus:border-navy focus:ring-navy"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {error && (
                        <div className="flex items-start rounded-md bg-red-50 p-4 text-red-800">
                          <svg
                            className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full transform rounded-md bg-primary px-8 py-3 text-white transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary/90 hover:shadow-lg md:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
