import React from 'react';
import {Card, CardContent} from '@/components/ui/card';
import Image from 'next/image';
import {TestimonialProps} from '@/lib/types';

const TestimonialCard = ({name, testimonial, imageUrl}: TestimonialProps) => {
  return (
    <Card className='w-full max-w-md shadow-md rounded-lg overflow-hidden bg-white'>
      <CardContent className='p-6'>
        <div className='flex items-center mb-4'>
          <div className='w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0'>
            <Image
              src={imageUrl}
              alt='Customer avatar'
              className='w-full h-full object-cover'
              width={30}
              height={30}
            />
          </div>
          <div>
            <h3 className='text-xl font-bold text-gray-900'>{name}</h3>
          </div>
        </div>
        <p className='text-gray-700'>{testimonial}</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
