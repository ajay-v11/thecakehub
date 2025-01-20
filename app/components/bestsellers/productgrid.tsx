'use client';

import {useState} from 'react';
import {ProductCard} from './productcard';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 5;

const PRODUCTS = [
  {
    id: 1,
    title: '3-tier red velvet cake',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/cake1.jpg',
  },
  {
    id: 2,
    title: 'Layered cream pastry',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/cake2.jpg',
  },
  {
    id: 3,
    title: 'Mint cupcake collection',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/placeholder.svg?height=300&width=400',
  },
  {
    id: 4,
    title: 'Chocolate truffle cake',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/placeholder.svg?height=300&width=400',
  },
  {
    id: 5,
    title: 'Berry cheesecake',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/placeholder.svg?height=300&width=400',
  },
  {
    id: 6,
    title: 'Vanilla bean tart',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    price: 45.9,
    imageUrl: '/placeholder.svg?height=300&width=400',
  },
];

export function ProductGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(PRODUCTS.length / PRODUCTS_PER_PAGE);

  const currentProducts = PRODUCTS.slice(
    currentPage * PRODUCTS_PER_PAGE,
    (currentPage + 1) * PRODUCTS_PER_PAGE
  );

  return (
    <div className='space-y-8 px-7 md:px-10 lg:px-20 pt-20'>
      <div className='flex justify-between items-center'>
        <div className='flex-grow border-t border-gray-300'></div>
        <span className='text-lg md:text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 bg-clip-text inline-block text-transparent pb-5 md:pb-7 lg:pb-10'>
          OUR BEST SELLERS
        </span>
        <div className='flex-grow border-t border-gray-300'></div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-4'>
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => addToCart(product)}
          />
        ))}
        <Link
          href='shop'
          className='text-sm md:text-base text-red-500 hover:text-red-600'>
          See All
        </Link>
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
