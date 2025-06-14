import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
  alignment?: 'left' | 'center';
  className?: string;
}

export default function PageHeader({
  title,
  breadcrumbs,
  alignment = 'left',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('relative overflow-hidden text-black', className)}>
      <div className="relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-8 flex text-sm text-black/70">
            <ol className="flex items-center">
              <li className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center transition-colors hover:text-primary"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Link>
                <ChevronRight className="mx-2 h-5 w-5" />
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-primary"
                      >
                        {crumb.label}
                      </Link>
                      <ChevronRight className="mx-2 h-5 w-5" />
                    </>
                  ) : (
                    <span className="font-lg line-clamp-[1] max-w-44 text-black/90 md:max-w-96">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {title && (
          <div
            className={cn(
              'max-w-3xl',
              alignment === 'center' ? 'mx-auto text-center' : ''
            )}
          >
            <h1 className="relative mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              {title}
              <div
                className={cn(
                  'mt-3 h-1 w-20 rounded-full bg-primary',
                  alignment === 'center' ? 'mx-auto' : ''
                )}
              ></div>
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
