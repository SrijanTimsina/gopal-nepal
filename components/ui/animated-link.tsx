"use client";

import type React from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

export function AnimatedLink({
  href,
  children,
  className,
  target = "_self",
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex text-sm font-medium text-primary transition-colors duration-300",
        "pb-2 after:absolute after:bottom-0 after:left-0 after:h-[2.3px] after:w-6 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-16",
        className,
      )}
      target={target}
    >
      <span>{children}</span>
    </Link>
  );
}
