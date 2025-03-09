'use server';
import {prisma} from '../prisma';

export async function acceptOrder(orderId: number) {
  try {
    const acceptOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: true,
      },
    });

    return {
      success: true,
      acceptOrder,
    };
  } catch (error) {
    console.error('Error Accepting order', error);

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

export async function markDeliver(orderId: number) {
  try {
    const acceptOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        delivered: true,
      },
    });

    return {
      success: true,
      acceptOrder,
    };
  } catch (error) {
    console.error('Error updating deliver status order', error);

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

export async function acceptCustomOrder(orderId: number) {
  try {
    const acceptOrder = await prisma.customOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status: true,
      },
    });

    return {
      success: true,
      acceptOrder,
    };
  } catch (error) {
    console.error('Error Accepting order', error);

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

export async function markCustomDeliver(orderId: number) {
  try {
    const acceptOrder = await prisma.customOrder.update({
      where: {
        id: orderId,
      },
      data: {
        delivered: true,
      },
    });

    return {
      success: true,
      acceptOrder,
    };
  } catch (error) {
    console.error('Error updating deliver status order', error);

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
