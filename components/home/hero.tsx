'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';

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
    <div className='h-[500px] md:h-[620px] bg-[#ffe7e7] flex flex-col-reverse md:flex-row justify-end items-center p-6 md:p-10 md:px-24 z-10 gap-3'>
      <div className='md:col-span-1 flex flex-col gap-2 md:gap-7 md:pr-20'>
        <h1 className='text-lg md:text-5xl font-bold leading-normal bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
          Sweet moments, freshly baked with love
        </h1>
        <p className='text-slate-800 text-sm md:text-lg font-thin'>
          Customized cakes, treats and everything sweet for all your special
          matters
        </p>
        <button className='bg-purple-700 text-white rounded-lg p-2 h-7 w-28  md:pb-9'>
          Shop now
        </button>
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
