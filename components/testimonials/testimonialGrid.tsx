import {TestimonialProps} from '@/lib/types';
import TestimonialCard from './testimonialCard';

export default function TestimonialGrid({
  testimonials,
}: {
  testimonials: TestimonialProps[];
}) {
  return (
    <div className='space-y-8 px-7 md:px-10 lg:px-20 pt-20 '>
      <div className='flex justify-between items-center '>
        <div className='flex-grow border-t border-gray-400'></div>
        <span className='text-lg md:text-4xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 bg-clip-text inline-block text-transparent pb-5 md:pb-7 lg:pb-10'>
          WHAT OUR CUSTOMERS SAY
        </span>
        <div className='flex-grow border-t border-gray-400'></div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-20 place-items-center '>
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
    </div>
  );
}
