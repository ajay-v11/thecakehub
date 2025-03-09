import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {CheckCircle2} from 'lucide-react';

import React from 'react';

interface OrderDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string | undefined;
}

export default function OrderDialog({
  open,
  setOpen,
  orderId,
}: OrderDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle2 className='h-6 w-6 text-green-500' />
            Order Placed Successfully!
          </DialogTitle>
        </DialogHeader>
        <div className='text-center space-y-4'>
          <p className='text-slate-600'>
            Thank you for your order. We will process it right away!
          </p>

          <Button
            onClick={() => router.push(`/`)}
            className='bg-purple-700 text-white hover:bg-purple-600'>
            Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
