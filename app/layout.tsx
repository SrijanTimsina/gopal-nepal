import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import NextAuthSessionProvider from '@/components/providers/session-provider';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Advocate Gopal Nepal',
  description: `Gopal Nepal is a dedicated Nepali academic and political activist from Molung Rural Municipality, Okhaldhunga. Born in 1993 (2050 B.S.), he completed his SLC from Baruneshwar Secondary School and pursued higher education at Amrit Campus, Kathmandu, majoring in Computer Science and Information Technology. He has served in various leadership roles within the ANNFSU, including Campus Committee Secretary, and contributed to student publications and movements. He co-published Nepal's first CSIT entrance preparation book through Ascol Creative Group. Gopal holds an LLB from Nepal Law Campus and a Master's in Political Science from Tribhuvan University. He is currently pursuing an MIT at Central Campus, Kirtipur, and is actively involved in politics as a permanent committee member of ANNFSU, head of the Legal and Federal Affairs Department, and district committee member of CPN-UML, Okhaldhunga. He has over 4.5 years of experience as an IT and Information Officer in Molung Rural Municipality and serves as secretary of the Guru Luintel Study and Development Center.`,
  openGraph: {
    type: 'website',
    title: 'Advocate Gopal Nepal',
    description:
      'Advocate Gopal Nepal is a legal professional, political activist, and IT expert from Nepal with a strong background in law, political science, and technology, currently pursuing an MIT and actively engaged in public service and youth leadership.',
    url: 'https://gopal-nepal.vercel.app/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Name' }],
    siteName: 'Advocate Gopal Nepal',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advocate Gopal Nepal',
    description:
      'Advocate Gopal Nepal is a legal professional, political activist, and IT expert from Nepal with a strong background in law, political science, and technology, currently pursuing an MIT and actively engaged in public service and youth leadership.',
    images: ['/og-image.jpg'],
  },
};

export const revalidate = 43200;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-navy ${inter.className}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <NextAuthSessionProvider>
          <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
