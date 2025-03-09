'use client';

import {User2} from 'lucide-react';
import {signOut, useSession} from 'next-auth/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState, useRef, useEffect} from 'react';
import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userIsOpen, setUserIsOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {data: session} = useSession();

  // Check if user is admin - safer approach
  const isAdmin = session?.user && (session.user as any).isAdmin === true;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle mobile menu
      if (isOpen && !(event.target as Element).closest('button')) {
        setIsOpen(false);
      }

      // Handle user dropdown menu
      if (
        userIsOpen &&
        userMenuRef.current &&
        avatarRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setUserIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, userIsOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close user menu if open
    if (userIsOpen) setUserIsOpen(false);
  };

  const toggleUserMenu = () => {
    setUserIsOpen(!userIsOpen);
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className='relative sticky top-0 z-50 bg-transparent'>
      {/* Glow effect */}
      <div className='absolute -inset-2 bg-purple-400 blur-md opacity-80 max-w-8xl z-30 mx-9 md:mx-20 rounded-2xl px-3 md:px-5'></div>
      <div className='bg-white backdrop-blur-md sticky top-0 h-9 md:h-16 z-30 mx-9 md:mx-20 rounded-2xl px-3 md:px-5 max-w-8xl ring-1 ring-gray-900/5'>
        <div className='h-full flex justify-between items-center'>
          {/* Left section */}
          <div>
            <Link
              href='/'
              className='text-pink-400 text-sm md:text-lg lg:text-xl font-bold'>
              The Cake Hub
            </Link>
          </div>

          {/* Middle section (Desktop Menu) */}
          <div className='hidden md:flex gap-4 md:gap-6 lg:gap-9 text-slate-800 text-smz md:text-base lg:text-xl'>
            <Link href='/' className='hover:text-pink-400'>
              Home
            </Link>
            <Link href='/shop' className='hover:text-pink-400'>
              Shop
            </Link>
            <Link href='/custom' className='hover:text-pink-400'>
              Custom Cake
            </Link>
            <Link href='/contact' className='hover:text-pink-400'>
              Contact
            </Link>
            {isAdmin && (
              <Link
                href='/dashboard/orders'
                className='hover:text-pink-400 font-medium text-pink-500'>
                All Orders
              </Link>
            )}
          </div>

          {/* Right section */}
          <div className='flex gap-2 md:gap-5 text-slate-800 text-sm md:text-base items-center'>
            <div
              ref={avatarRef}
              className='relative flex flex-col items-center hidden md:block cursor-pointer'
              onClick={toggleUserMenu}>
              <Avatar>
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback>
                  {session?.user?.name ? session.user.name.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              {session?.user?.name && (
                <h2 className='text-sm'>{session.user.name.split(' ')[0]}</h2>
              )}

              {/* User dropdown menu */}
              {userIsOpen && (
                <div
                  ref={userMenuRef}
                  className='absolute top-full right-0 mt-2 bg-white shadow-md rounded-lg p-4 min-w-32 z-50'>
                  <div className='flex flex-col gap-4 text-slate-800 text-sm'>
                    <Link href='/' className='hover:text-pink-400'>
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href='/dashboard/orders'
                        className='hover:text-pink-400 font-medium text-pink-500'>
                        All Orders
                      </Link>
                    )}
                    {session ? (
                      <button
                        onClick={() => signOut({callbackUrl: '/'})}
                        className='text-red-500 hover:text-pink-400 text-left'>
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={handleLogin}
                        className='hover:text-pink-400 text-left'>
                        Login
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile - User Icon or Login */}
            <div className='block md:hidden'>
              {session ? (
                <Avatar className='size-6' onClick={toggleUserMenu}>
                  <AvatarImage src={session.user?.image ?? undefined} />
                  <AvatarFallback>
                    {session.user?.name ? session.user.name.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User2
                  className='size-5 cursor-pointer'
                  onClick={handleLogin}
                />
              )}
            </div>

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
            <Link href='/custom' className='hover:text-pink-400'>
              Custom Cake
            </Link>
            <Link href='/contact' className='hover:text-pink-400'>
              Contact
            </Link>
            {isAdmin && (
              <Link
                href='/dashboard/orders'
                className='hover:text-pink-400 font-medium text-pink-500'>
                All Orders
              </Link>
            )}
            {session && (
              <>
                <Link href='/' className='hover:text-pink-400'>
                  My Orders
                </Link>
              </>
            )}
            {!session ? (
              <button
                onClick={handleLogin}
                className='hover:text-pink-400 text-left'>
                Login
              </button>
            ) : (
              <button
                onClick={() => signOut({callbackUrl: '/'})}
                className='text-red-500 hover:text-pink-400 text-left'>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
