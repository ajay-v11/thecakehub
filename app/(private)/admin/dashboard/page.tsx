'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';

// Mock data for orders
const initialOrders = [
  {
    id: 1,
    customerName: 'Alice Johnson',
    items: ['Chocolate Cake', 'Cupcakes'],
    total: 55,
    status: 'pending',
  },
  {
    id: 2,
    customerName: 'Bob Smith',
    items: ['Vanilla Cake', 'Cookies'],
    total: 40,
    status: 'pending',
  },
  {
    id: 3,
    customerName: 'Charlie Brown',
    items: ['Red Velvet Cake'],
    total: 35,
    status: 'accepted',
  },
  {
    id: 4,
    customerName: 'Diana Prince',
    items: ['Fruit Tart', 'Macarons'],
    total: 30,
    status: 'delivered',
  },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState(initialOrders);

  const handleAccept = (id: number) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? {...order, status: 'accepted'} : order
      )
    );
  };

  const handleDeliver = (id: number) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? {...order, status: 'delivered'} : order
      )
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#ffe7e7] to-pink-200 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
          Admin Dashboard
        </h1>
        <Card className='bg-white shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold text-purple-800'>
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[calc(100vh-200px)] pr-4'>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className='mb-4 p-4 border border-purple-200 rounded-lg'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3 className='text-lg font-semibold text-purple-900'>
                        {order.customerName}
                      </h3>
                      <p className='text-sm text-slate-600'>
                        Order #{order.id}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'pending'
                          ? 'default'
                          : order.status === 'accepted'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={`${
                        order.status === 'pending'
                          ? 'bg-yellow-500'
                          : order.status === 'accepted'
                          ? 'bg-green-500'
                          : 'bg-purple-500 text-white'
                      }`}>
                      {order.status}
                    </Badge>
                  </div>
                  <ul className='list-disc list-inside mb-2 text-slate-700'>
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className='text-right font-semibold text-purple-800'>
                    Total: ${order.total}
                  </p>
                  <div className='mt-3 flex justify-end space-x-2'>
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => handleAccept(order.id)}
                        variant='outline'
                        className='border-green-500 text-green-500 hover:bg-green-50'>
                        Accept
                      </Button>
                    )}
                    {(order.status === 'pending' ||
                      order.status === 'accepted') && (
                      <Button
                        onClick={() => handleDeliver(order.id)}
                        variant='outline'
                        className='border-purple-500 text-purple-500 hover:bg-purple-50'>
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
