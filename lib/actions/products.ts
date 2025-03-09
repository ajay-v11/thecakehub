'use server';
import {prisma} from '../prisma';
import {NewProduct} from '../types';

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany();

    return {success: true, products};
  } catch (error: any) {
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

export async function addProduct(params: NewProduct) {
  try {
    const product = await prisma.product.create({
      data: {
        title: params.title,
        category: params.category,
        description: params.description,
        imageUrl: params.imageUrl,
        price: params.price,
      },
    });

    return {success: true, product};
  } catch (error: any) {
    //errorMessage: error.message,
    //errorStack: error.stack,
    console.error('dete', {
      errorMessage: error.message,
      errroStack: error.stack,
    });
    return {success: false, error: error.message};
  } finally {
    // Optionally disconnect in production
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}
