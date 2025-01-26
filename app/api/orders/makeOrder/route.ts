import { prisma } from '@/lib/prisma';
import {NextRequest} from 'next/server';

export async function POST(request: NextRequest) {

    const body=await request.json();

    try{
        const order=await prisma.order.update({
            data:{
                body
            }
           
        })
    }

}
