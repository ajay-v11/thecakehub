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

export async function makeCustomOrder(params) {
  try {
    if (
      !params.cakeDescription ||
      !params.customerDetails.name ||
      !params.customerDetails.phone
    ) {
      throw new Error('Missing requeired customer order details');
    }

    const customOrder = await prisma.customOrder.create({
      data: {
        userId: params.userId,
        description: params.cakeDescription,
        customerName: params.customerDetails.name,
        customerPhone: params.customerDetails.phone,
        customerAddress: params.customerDetails.address || '',
        customerEmail: params.customerDetails.email || '',
        hasCustomImage: !!params.customImage,
        selectedTemplate: params.selectedTemplate
          ? params.selectedTemplate.name
          : null,
        customImage: params.customImage
          ? Buffer.from(await params.customImage.arrayBuffer())
          : null,
      },
    });
    return {
      success: true,
      customOrder,
    };
  } catch (error) {
    console.error('Error creating custom order', error);
    return {
      success: false,
      error: String(error),
    };
  } finally {
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

export async function getAllCustomOrders() {
  try {
    const customOrders = await prisma.customOrder.findMany();

    return {
      success: true,
      customOrders,
    };
  } catch (error) {
    console.error('Error fetching custom Orders', error);

    return {
      success: false,
      error: String(error),
    };
  } finally {
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}
