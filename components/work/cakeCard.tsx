import React from 'react';
import Image from 'next/image';
import {CakeCardProps} from '@/lib/types';

function CakeCard({name, imageUrl}: CakeCardProps) {
  return (
    <div className='bg-gray-100/40 shadow-lg rounded-md backdrop-blur-lg w-full h-64 md:h-80 lg:h-96 overflow-hidden'>
      <div className='relative h-full w-full rounded-lg'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw'
          className='object-cover p-2 sm:p-3 rounded-lg'
          priority
        />
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2'>
          <h2 className='p-2 font-extrabold text-lg sm:text-xl md:text-2xl text-white truncate'>
            {name}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CakeCard;
