'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import {MapPin} from 'lucide-react';
import Link from 'next/link';

const slides = [
  {src: '/cake1.jpg'},
  {src: '/cake2.jpg'},
  {src: '/cake3.jpg'},
  {src: '/cake4.jpg'},
  {src: '/cake5.jpg'},
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='relative h-[550px] md:h-[650px] flex flex-col-reverse md:flex-row justify-end items-center px-5 pt-5 md:pt-1  md:px-24 z-10 gap-3  bg-gradient-to-b from-white via-[#ffe7e7]  to-pink-200'>
      <div className='custom-shape-divider-bottom-1736773001'>
        <svg
          data-name='Layer 1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'>
          <path
            d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
            className='shape-fill'></path>
        </svg>
      </div>
      <div className='md:col-span-1 flex flex-col gap-2 md:gap-7 md:pr-20'>
        <h1 className='text-2xl md:text-5xl font-bold leading-normal bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
          Sweet moments, freshly baked with love
        </h1>
        <p className='text-slate-800 text-base md:text-lg font-thin'>
          Customized cakes, treats and everything sweet for all your special
          matters.
        </p>
        <p className='text-slate-800 text-base md:text-lg font-thin flex flex-row'>
          <span className='pr-2'>
            <MapPin className='scale-90 md:scale-100' />
          </span>
          Nabarangpur, Odisha
        </p>
        <Link
          href='/shop'
          className='bg-purple-700 text-white font-base text-base md:font-semibold md:text-xl rounded-lg p-2 md:p-3  w-24 md:w-36 max-w-40 hover:bg-purple-500 hover:scale-90'>
          Order now
        </Link>
      </div>
      <div className='relative size-36 w-full bg-blue-300 h-[230px] md:h-[450px] md:col-span-1 overflow-hidden rounded-xl'>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}>
            <Image
              src={slide.src}
              alt={`cake image ${index + 1}`}
              fill
              className='object-cover'
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay indicators */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20'>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
