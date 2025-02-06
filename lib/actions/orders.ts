'use server';
import {prisma} from '../prisma';
import {makeOrderType} from '../types';

export async function makeOrder(params: makeOrderType) {
  try {
    // Validate required fields
    if (
      !params.userId ||
      !params.customerDetails.name ||
      !params.customerDetails.phone
    ) {
      throw new Error('Missing required order details');
    }

    const order = await prisma.order.create({
      data: {
        userId: params.userId,
        customerName: params.customerDetails.name,
        customerPhone: params.customerDetails.phone,
        customerAddress: params.customerDetails.address || '',
        customerEmail: params.customerDetails.email || '',
        message: params.message || '',
        paymentMethod: params.paymentMethod,
        total: params.total,
        orderItems: {
          create: params.items.map((item) => ({
            product: {
              create: {
                title: item.title,
                description: item.description || '',
                price: item.price,
                imageUrl: item.imageUrl || '',
                category: item.category || 'Uncategorized',
                quantity: item.quantity,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return {success: true, order};
  } catch (error) {
    console.error('Detailed Error:', {
      // errorName: error.name,
      //errorMessage: error.message,
      //errorStack: error.stack,
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    return {
      success: false,
      error: String(error),
    };
  } finally {
    // Optionally disconnect in production
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

export async function getAllOrder() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return {success: true, orders};
  } catch (error) {
    console.error('error', error);
    return {
      success: false,
      error: String(error),
    };
  } finally {
    // Optionally disconnect in production
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}
