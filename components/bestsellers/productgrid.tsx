'use client';

import {useState} from 'react';
import {ProductCard} from './productcard';
import Link from 'next/link';
import {useCartStore} from '@/lib/cartStore';
import {Product} from '@/lib/types';

const PRODUCTS_PER_PAGE = 5;

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Chocolate cake',
    description: 'Rich chocolate cake with dark chocolate ganache',
    price: 55.0,
    imageUrl: '/cake1.jpg',
    category: 'Cakes',
  },
  {
    id: 2,
    title: 'Red velvet cake',
    description: 'Classic red velvet with cream cheese frosting',
    price: 60.0,
    imageUrl: '/cake2.jpg',
    category: 'Cakes',
  },
  {
    id: 3,
    title: 'Chicken puff',
    description: 'Flaky pastry filled with seasoned chicken',
    price: 25.0,
    imageUrl: '/cake3.jpg',
    category: 'Puffs',
  },
  {
    id: 4,
    title: 'Vegetable puff',
    description: 'Crispy puff pastry with mixed vegetables',
    price: 20.0,
    imageUrl: '/cake4.jpg',
    category: 'Puffs',
  },
  {
    id: 5,
    title: 'Fruit tart',
    description: 'Fresh seasonal fruits on vanilla custard',
    price: 40.0,
    imageUrl: '/cake5.jpg',
    category: 'Tarts',
  },
  {
    id: 6,
    title: 'Vanilla bean tart',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    price: 45.9,
    imageUrl: '/cake6.jpg',
    category: 'Tarts',
  },
];

export function ProductGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(PRODUCTS.length / PRODUCTS_PER_PAGE);

  const currentProducts = PRODUCTS.slice(
    currentPage * PRODUCTS_PER_PAGE,
    (currentPage + 1) * PRODUCTS_PER_PAGE
  );
  const addToCart = useCartStore((state) => state.addToCart);

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
