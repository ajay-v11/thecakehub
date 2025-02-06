'use server';
import {prisma} from '../prisma';

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany();
    console.log(products);
    return {success: true, products};
  } catch (error) {
    //errorMessage: error.message,
    //errorStack: error.stack,

    console.error('dete', {
      errorMessage: error.message,
      errroStack: error.stack,
    });
  } finally {
    // Optionally disconnect in production
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}
