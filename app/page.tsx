import Header from '@/components/home/header';
import Hero from '@/components/home/hero';

export default function Home() {
  return (
    <>
      <div className='min-h-screen pb-5 bg-[#ffe7e7]'>
        <Header />
        <Hero />
      </div>
    </>
  );
}
