import {prisma} from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server';

export async function GET() {
  try {
    const result = await prisma.order.findMany();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({message: 'user created', data: body});
}
