'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ChevronDown, ChevronUp, Trash2} from 'lucide-react';
import {getAllOrder} from '@/lib/actions/orders';

// Type definitions
interface Product {
  id: number;
  title: string;
  price: number;
}

interface OrderItem {
  id: number;
  orderId: number;
  product: Product;
  productId: number;
  quantity: number;
}

interface ServerOrder {
  id: number;
  userId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  message: string;
  orderItems: OrderItem[];
  paymentMethod: string;
  total: number;
  createdAt: string;
}

interface TransformedItem {
  name: string;
  quantity: number;
  price: number;
}

interface UIOrder extends ServerOrder {
  status: 'pending' | 'accepted' | 'delivered';
  items: TransformedItem[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await getAllOrder();
      // Transform the data to include necessary UI state
      const transformedOrders: UIOrder[] = response.orders
        .map((order: ServerOrder) => ({
          ...order,
          status: 'pending', // Add default status if not present in response
          items: order.orderItems.map((item) => ({
            name: item.product.title,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setOrders(transformedOrders);
    };
    fetchOrders();
  }, []);

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

  const handleRemove = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const toggleOrderDetails = (id: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                        Order #{order.id} - {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
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
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleOrderDetails(order.id)}
                        className='p-1'>
                        {expandedOrders.has(order.id) ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <ul className='list-disc list-inside mb-2 text-slate-700'>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} (x{item.quantity}) - Rs.
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>

                  {expandedOrders.has(order.id) && (
                    <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                      <h4 className='font-semibold mb-2'>Order Details</h4>
                      <dl className='grid grid-cols-2 gap-2 text-sm'>
                        <dt className='text-gray-600'>Phone:</dt>
                        <dd>{order.customerPhone}</dd>
                        <dt className='text-gray-600'>Email:</dt>
                        <dd>{order.customerEmail || 'Not provided'}</dd>
                        <dt className='text-gray-600'>Address:</dt>
                        <dd>{order.customerAddress}</dd>
                        <dt className='text-gray-600'>Payment Method:</dt>
                        <dd className='capitalize'>{order.paymentMethod}</dd>
                        <dt className='text-gray-600'>Message:</dt>
                        <dd>{order.message || 'No message'}</dd>
                      </dl>
                    </div>
                  )}

                  <p className='text-right font-semibold text-purple-800'>
                    Total: Rs{order.total}
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
                    <Button
                      onClick={() => handleRemove(order.id)}
                      variant='outline'
                      className='border-red-500 text-red-500 hover:bg-red-50'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
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
