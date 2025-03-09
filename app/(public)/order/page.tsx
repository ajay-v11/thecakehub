'use client';
import {useState} from 'react';
import {CheckCircle, Truck, Timer, PackageCheck} from 'lucide-react';
import {Button} from '@/components/ui/button';
import Image from 'next/image';

const OrderPlaced = () => {
  // const [status, setStatus] = useState(order.status || 'Accepted');{order}

  const statusSteps = [
    {label: 'Accepted', icon: <CheckCircle className='text-green-500' />},
    {label: 'Preparing', icon: <Timer className='text-yellow-500' />},
    {label: 'Out for Delivery', icon: <Truck className='text-blue-500' />},
    {label: 'Delivered', icon: <PackageCheck className='text-purple-700' />},
  ];

  const order = {
    id: 1,
    items: [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        quantity: 1,
        imageUrl: '/public/cake1.jpg',
      },
    ],
    total: 100,
    status: 'Accepted',
    estimatedDelivery: '30-45 mins',
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#ffe7e7] to-pink-200 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8'>
        <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
          Order Placed Successfully!
        </h1>

        <div className='space-y-6'>
          <h2 className='text-xl font-semibold text-purple-800'>
            Order Details
          </h2>
          <div className='space-y-4'>
            {order.items.map((item) => (
              <div
                key={item.id}
                className='flex justify-between items-center bg-gray-100 p-4 rounded-lg'>
                <Image
                  src={item.imageUrl}
                  alt='item image'
                  width={60}
                  height={50}
                  className='rounded-md'
                />
                <div className='text-slate-800'>{item.title}</div>
                <span className='text-purple-900 font-bold'>
                  Rs {item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className='text-right text-lg font-bold text-purple-900'>
              Total: Rs {order.total}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-purple-800'>
            Order Status
          </h2>
          <div className='flex justify-between mt-4 px-2 sm:px-6'>
            {statusSteps.map((step) => (
              <div key={step.label} className='flex flex-col items-center'>
                {step.icon}
                <span
                  className={`text-sm font-medium ${
                    status === step.label ? 'text-purple-700' : 'text-gray-500'
                  }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-purple-800'>
            Estimated Delivery
          </h2>
          <p className='text-lg text-purple-900 font-semibold mt-2'>
            {order.estimatedDelivery || '30-45 mins'}
          </p>
        </div>

        <div className='mt-8'>
          <Button className='w-full bg-purple-700 text-white hover:bg-purple-600'>
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
