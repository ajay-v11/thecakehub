'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {getAllOrder, getAllCustomOrders} from '@/lib/actions/orders';
import {
  acceptCustomOrder,
  acceptOrder,
  markCustomDeliver,
  markDeliver,
} from '@/lib/actions/orderStatus';
import {sendCustomOrderEmail, sendOrderEmail} from '@/lib/actions/sendMail';

// Type definitions for Orders page
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
  customerEmail: string | null;
  customerAddress: string;
  message: string;
  orderItems: OrderItem[];
  paymentMethod: string;
  total: number;
  status: boolean; // Matches DB schema (accepted)
  delivered: boolean; // Matches DB schema
  createdAt: string;
}

interface TransformedItem {
  name: string;
  quantity: number;
  price: number;
}

interface UIOrder extends Omit<ServerOrder, 'status' | 'delivered'> {
  status: 'pending' | 'accepted' | 'delivered';
  items: TransformedItem[];
}

// Add CustomOrder interface
interface ServerCustomOrder {
  id: number;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string | null;
  hasCustomImage: boolean;
  selectedTemplate: string | null;
  customImage: Buffer | null;
  status: boolean; // Matches DB schema (accepted)
  delivered: boolean; // Matches DB schema
  createdAt: string;
}

interface UICustomOrder
  extends Omit<ServerCustomOrder, 'status' | 'delivered'> {
  status: 'pending' | 'accepted' | 'delivered';
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [customOrders, setCustomOrders] = useState<UICustomOrder[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [expandedCustomOrders, setExpandedCustomOrders] = useState<Set<number>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<'regular' | 'custom'>('regular');

  useEffect(() => {
    const fetchOrders = async () => {
      // Fetch regular orders
      const response = await getAllOrder();

      // Transform the data to include necessary UI state
      const transformedOrders: UIOrder[] = response.orders
        .map((order: ServerOrder) => {
          // Determine status based on delivered and status (accepted) flags
          let orderStatus: 'pending' | 'accepted' | 'delivered' = 'pending';
          if (order.delivered) {
            orderStatus = 'delivered';
          } else if (order.status) {
            orderStatus = 'accepted';
          }

          return {
            ...order,
            status: orderStatus,
            items: order.orderItems.map((item) => ({
              name: item.product.title,
              quantity: item.quantity,
              price: item.product.price,
            })),
          };
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setOrders(transformedOrders);

      // Fetch custom orders
      const customResponse = await getAllCustomOrders();
      if (customResponse.success && customResponse.customOrders) {
        const transformedCustomOrders = customResponse.customOrders
          .map((order: ServerCustomOrder) => {
            // Determine status based on delivered and status (accepted) flags
            let orderStatus: 'pending' | 'accepted' | 'delivered' = 'pending';
            if (order.delivered) {
              orderStatus = 'delivered';
            } else if (order.status) {
              orderStatus = 'accepted';
            }

            return {
              ...order,
              status: orderStatus,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setCustomOrders(transformedCustomOrders);
      }
    };
    fetchOrders();
  }, []);

  const handleAccept = async (order: UIOrder) => {
    const result = await acceptOrder(order.id);
    if (result.success) {
      setOrders(
        orders.map((o) => (o.id === order.id ? {...o, status: 'accepted'} : o))
      );

      const emailPayload = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        total: order.total,
      };

      const emailResponse = await sendOrderEmail(
        emailPayload,
        'orderConfirmed'
      );

      if (emailResponse.status === 200) {
        alert('Order confirmed');
      } else {
        console.warn(
          'Failed to send order confirmation email:',
          emailResponse.message
        );
      }
    } else {
      alert('Server error');
    }
  };

  const handleDeliver = async (order: UIOrder) => {
    const result = await markDeliver(order.id);
    if (result.success) {
      setOrders(
        orders.map((o) => (o.id === order.id ? {...o, status: 'delivered'} : o))
      );

      const emailPayload = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        total: order.total,
      };

      const emailResponse = await sendOrderEmail(
        emailPayload,
        'orderDelivered'
      );

      if (emailResponse.status === 200) {
        alert('Order Delivered');
      } else {
        console.warn(
          'Failed to send order delivery email:',
          emailResponse.message
        );
      }
    } else {
      alert('Server error');
    }
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

  const handleAcceptCustom = async (order: UICustomOrder) => {
    const result = await acceptCustomOrder(order.id);
    if (result.success) {
      setCustomOrders(
        customOrders.map((o) =>
          o.id === order.id ? {...o, status: 'accepted'} : o
        )
      );

      // Send email notification using the new function
      if (order.customerEmail) {
        const emailPayload = {
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          description: order.description,
        };

        const emailResponse = await sendCustomOrderEmail(
          emailPayload,
          'customOrderConfirmed'
        );

        if (emailResponse.status === 200) {
          alert('Custom Order confirmed');
        } else {
          console.warn(
            'Failed to send custom order confirmation email:',
            emailResponse.message
          );
        }
      }
    } else {
      alert('Server error while accepting order');
    }
  };

  const handleDeliverCustom = async (order: UICustomOrder) => {
    const result = await markCustomDeliver(order.id);
    if (result.success) {
      setCustomOrders(
        customOrders.map((o) =>
          o.id === order.id ? {...o, status: 'delivered'} : o
        )
      );

      // Send email notification using the new function
      if (order.customerEmail) {
        const emailPayload = {
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          description: order.description,
        };

        const emailResponse = await sendCustomOrderEmail(
          emailPayload,
          'customOrderDelivered'
        );

        if (emailResponse.status === 200) {
          alert('Custom Order Delivered');
        } else {
          console.warn(
            'Failed to send custom order delivery email:',
            emailResponse.message
          );
        }
      }
    } else {
      alert('Server error while marking delivery');
    }
  };

  const toggleCustomOrderDetails = (id: number) => {
    setExpandedCustomOrders((prev) => {
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

        <div className='flex space-x-2 mb-4'>
          <Button
            variant={activeTab === 'regular' ? 'default' : 'outline'}
            onClick={() => setActiveTab('regular')}
            className={activeTab === 'regular' ? 'bg-purple-700' : ''}>
            Regular Orders
          </Button>
          <Button
            variant={activeTab === 'custom' ? 'default' : 'outline'}
            onClick={() => setActiveTab('custom')}
            className={activeTab === 'custom' ? 'bg-purple-700' : ''}>
            Custom Orders
          </Button>
        </div>

        <Card className='bg-white shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold text-purple-800'>
              {activeTab === 'regular'
                ? 'Regular Orders'
                : 'Custom Cake Orders'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[calc(100vh-200px)] pr-4'>
              {activeTab === 'regular'
                ? // Regular orders
                  orders.map((order) => (
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
                            <dd className='capitalize'>
                              {order.paymentMethod}
                            </dd>
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
                            onClick={() => handleAccept(order)}
                            variant='outline'
                            className='border-green-500 text-green-500 hover:bg-green-50'>
                            Accept
                          </Button>
                        )}
                        {(order.status === 'pending' ||
                          order.status === 'accepted') && (
                          <Button
                            onClick={() => handleDeliver(order)}
                            variant='outline'
                            className='border-purple-500 text-purple-500 hover:bg-purple-50'>
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                : // Custom orders
                  customOrders.map((order) => (
                    <div
                      key={order.id}
                      className='mb-4 p-4 border border-purple-200 rounded-lg'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h3 className='text-lg font-semibold text-purple-900'>
                            {order.customerName}
                          </h3>
                          <p className='text-sm text-slate-600'>
                            Custom Order #{order.id} -{' '}
                            {formatDate(order.createdAt)}
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
                            onClick={() => toggleCustomOrderDetails(order.id)}
                            className='p-1'>
                            {expandedCustomOrders.has(order.id) ? (
                              <ChevronUp className='h-4 w-4' />
                            ) : (
                              <ChevronDown className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className='mb-2 text-slate-700'>
                        <p>
                          <strong>Cake Description:</strong> {order.description}
                        </p>
                        {order.selectedTemplate && (
                          <p>
                            <strong>Template:</strong> {order.selectedTemplate}
                          </p>
                        )}
                        <p>
                          <strong>Has Custom Image:</strong>{' '}
                          {order.hasCustomImage ? 'Yes' : 'No'}
                        </p>
                      </div>

                      {expandedCustomOrders.has(order.id) && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                          <h4 className='font-semibold mb-2'>
                            Customer Details
                          </h4>
                          <dl className='grid grid-cols-2 gap-2 text-sm'>
                            <dt className='text-gray-600'>Phone:</dt>
                            <dd>{order.customerPhone}</dd>
                            <dt className='text-gray-600'>Email:</dt>
                            <dd>{order.customerEmail || 'Not provided'}</dd>
                            <dt className='text-gray-600'>Address:</dt>
                            <dd>{order.customerAddress || 'Not provided'}</dd>
                          </dl>
                        </div>
                      )}

                      <div className='mt-3 flex justify-end space-x-2'>
                        {order.status === 'pending' && (
                          <Button
                            onClick={() => handleAcceptCustom(order)}
                            variant='outline'
                            className='border-green-500 text-green-500 hover:bg-green-50'>
                            Accept
                          </Button>
                        )}
                        {(order.status === 'pending' ||
                          order.status === 'accepted') && (
                          <Button
                            onClick={() => handleDeliverCustom(order)}
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
