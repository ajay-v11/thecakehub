'use client';

import {Search} from 'lucide-react';
import {signOut, useSession} from 'next-auth/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import React from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const {data: session} = useSession();
  console.log('session', session);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleAdmin = async () => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: 1, adminStatus: true}),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const data = await response.json();
      console.log(data);
    } catch (err: any) {
      console.log(err);
    }
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
            <Link href='/' className='hover:text-pink-400'>
              Home
            </Link>
            <Link href='/shop' className='hover:text-pink-400'>
              Shop
            </Link>
            <Link href='#services' className='hover:text-pink-400'>
              Services
            </Link>
            <a href='#blog' className='hover:text-pink-400'>
              Blog
            </a>
          </div>

          {/* Right section */}
          <div className='flex gap-2 md:gap-5 text-slate-800 text-sm md:text-base items-center'>
            {!session ? (
              <button onClick={handleLogin} className='hidden md:block'>
                Login
              </button>
            ) : (
              <button
                onClick={() => signOut({callbackUrl: '/'})}
                className='hidden md:block hover:text-red-500'>
                Logout<p>{session.user?.name}!</p>
              </button>
            )}

            {/* Search Icon */}
            <button onClick={handleAdmin}>
              <Search className='size-5' />
            </button>

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
            <Link href='/' className='hover:text-pink-400'>
              Home
            </Link>
            <Link href='/shop' className='hover:text-pink-400'>
              Shop
            </Link>
            <a href='#contact' className='hover:text-pink-400'>
              Contact us
            </a>
            <a href='#contact' className='hover:text-pink-400'>
              My Account
            </a>

            {!session ? (
              <div onClick={handleLogin} className='hover:text-pink-400'>
                Login
              </div>
            ) : (
              <div
                onClick={() => signOut({callbackUrl: '/'})}
                className='hover:text-pink-400'>
                Logout
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
