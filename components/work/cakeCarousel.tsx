'use client';
import {CakeCardProps} from '@/lib/types';
import React, {useState, useEffect} from 'react';
import CakeCard from './cakeCard';
import Link from 'next/link';

const CardsPerPage = {
  sm: 2,
  md: 3,
  lg: 4,
};

const CustomCakes: CakeCardProps[] = [
  {name: 'Doremon cake', imageUrl: '/cake1.jpg'},
  {name: 'Baby boss', imageUrl: '/cake2.jpg'},
  {name: 'Bumchik', imageUrl: '/cake3.jpg'},
  {name: 'sfdgklsdf', imageUrl: '/cake3.jpg'},
  {name: 'Bfdgsdf', imageUrl: '/cake3.jpg'},
  {name: 'dfgsdfg', imageUrl: '/cake3.jpg'},
  {name: 'Bdfgsdf', imageUrl: '/cake3.jpg'},
];

function CakeCarousel() {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(CardsPerPage.sm);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(CardsPerPage.sm);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(CardsPerPage.md);
      } else {
        setCardsPerPage(CardsPerPage.lg);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(CustomCakes.length / cardsPerPage);

  const currentCards = CustomCakes.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  return (
    <div className='space-y-8 px-4 sm:px-7 md:px-10 lg:px-20 pt-16 sm:pt-20'>
      <div className='flex justify-between items-center'>
        <div className='flex-grow border-t border-gray-400'></div>
        <span className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 bg-clip-text inline-block text-transparent pb-3 md:pb-7 lg:pb-10'>
          OUR WORKS
        </span>
        <div className='flex-grow border-t border-gray-400'></div>
      </div>
      {/* Fixed grid classes using responsive breakpoints instead of dynamic values */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 lg:gap-12'>
        {currentCards.map((card) => (
          <div key={card.name} className='w-full'>
            <CakeCard {...card} />
          </div>
        ))}
        <div className='flex items-center justify-center'>
          <Link
            href='/custom'
            className='flex items-center justify-center h-full w-full text-base md:text-lg text-purple-700 font-semibold hover:text-pink-500 transition-colors border-2 border-dashed border-purple-300 hover:border-pink-500 rounded-lg p-4 '>
            Order A Custom Cake
          </Link>
        </div>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center gap-2 pt-4'>
          {Array.from({length: totalPages}).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                index === currentPage
                  ? 'bg-purple-600'
                  : 'bg-purple-200 hover:bg-purple-300'
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CakeCarousel;
