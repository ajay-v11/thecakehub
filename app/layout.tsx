import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import Header from './components/home/header';
import Footer from './components/home/footer';

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
      <body className={`${inter.className} antialiased `}>
        <Header />
        <main className='mb-40'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
