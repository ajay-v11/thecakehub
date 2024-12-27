const Header = () => {
  return (
    <div className='bg-white sticky top-0 h-9 md:h-16 z-30 mx-9 md:mx-20 rounded-2xl  px-3 md:px-5'>
      <div className='h-full flex justify-between items-center'>
        {/* Left section */}
        <div>
          <h1 className='text-pink-400 text-sm md:text-xl font-bold'>
            The Cake Hub
          </h1>
        </div>

        {/* Middle section */}
        <div className='hidden md:visible md:flex gap-9 text-slate-800 text-lg'>
          <h1>Home</h1>
          <h1>Shop</h1>
          <h1>Services</h1>
          <h1>Blog</h1>
        </div>

        {/* Right section */}
        <div className='flex gap-2 text-slate-800 text-sm md:text-base items-center'>
          <h1 className='hidden md:visible'>Login/Register</h1>
          <h1>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='size-4 md:size-6'>
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
              />
            </svg>
          </h1>

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;
