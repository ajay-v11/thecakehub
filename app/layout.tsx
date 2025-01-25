import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import Header from '../components/home/header';
import Footer from '../components/home/footer';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], // Add weights you need
});

export const metadata: Metadata = {
  title: 'The Cake Hub',
  description: 'Order custom cakes, pastries and any other baked items online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Providers>
        <body className={`${inter.className} antialiased `}>
          <Header />
          <main className='mb-50'>{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
