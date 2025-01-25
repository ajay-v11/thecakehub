import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const {userId, adminStatus} = body;

    // Validate input
    if (typeof userId !== 'number' || typeof adminStatus !== 'boolean') {
      return NextResponse.json({error: 'Invalid input'}, {status: 400});
    }

    // Update the user in the database
    const updateUser = await prisma.user.update({
      where: {id: userId},
      data: {isAdmin: adminStatus},
    });

    // Respond with the updated user data
    return NextResponse.json(updateUser, {status: 200});
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
