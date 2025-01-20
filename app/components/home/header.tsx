'use client';

import {Search} from 'lucide-react';
import Link from 'next/link';
import {useState} from 'react';
import React from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative sticky top-0 z-50  bg-transparent'>
      {/* Glow effect */}
      <div className='absolute -inset-2 bg-purple-400  blur-md opacity-80 max-w-8xl  z-30 mx-9 md:mx-20 rounded-2xl px-3 md:px-5 '></div>
      <div className=' bg-white backdrop-blur-md  sticky top-0 h-9 md:h-16 z-30 mx-9 md:mx-20 rounded-2xl px-3 md:px-5 max-w-8xl ring-1 ring-gray-900/5 '>
        <div className='h-full flex justify-between items-center'>
          {/* Left section */}
          <div>
            <Link
              href='/'
              className='text-pink-400 text-sm md:text-xl font-bold'>
              The Cake Hub
            </Link>
          </div>

          {/* Middle section (Desktop Menu) */}
          <div className='hidden md:flex gap-9 text-slate-800 text-lg'>
            <a href='#home' className='hover:text-pink-400'>
              Home
            </a>
            <a href='#shop' className='hover:text-pink-400'>
              Shop
            </a>
            <a href='#services' className='hover:text-pink-400'>
              Services
            </a>
            <a href='#blog' className='hover:text-pink-400'>
              Blog
            </a>
          </div>

          {/* Right section */}
          <div className='flex gap-2 md:gap-5 text-slate-800 text-sm md:text-base items-center'>
            <Link href='' className='hidden md:block'>
              Login/Register
            </Link>

            {/* Cart Icon */}
            <button>
              <Search className='size-5' />
            </button>
            <Link href=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 md:w-6 md:h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                />
              </svg>
            </Link>

            {/* Hamburger Menu */}
            <button onClick={toggleMenu} className='block md:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable Menu for Mobile */}
        {isOpen && (
          <div className='flex flex-col gap-4 mt-2 bg-white shadow-md rounded-lg p-4 text-slate-800 text-sm'>
            <a href='#home' className='hover:text-pink-400'>
              Home
            </a>
            <a href='#shop' className='hover:text-pink-400'>
              Shop
            </a>
            <a href='#services' className='hover:text-pink-400'>
              Services
            </a>
            <a href='#blog' className='hover:text-pink-400'>
              Blog
            </a>
            <a href='#login' className='hover:text-pink-400'>
              Login/Register
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
