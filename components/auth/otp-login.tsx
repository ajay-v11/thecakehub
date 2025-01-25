'use client';
import {auth} from '@/lib/firebase';
import {ConfirmationResult, signInWithPhoneNumber} from 'firebase/auth';
import {RecaptchaVerifier} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import React, {FormEvent, useEffect, useState, useTransition} from 'react';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import {LoaderIcon} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../ui/input-otp';

function OtpLogin() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const setupRecaptcha = async () => {
      try {
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              console.log('Captcha solved', response);
            },
          }
        );
        await recaptchaVerifier.render();
        setRecaptchaVerifier(recaptchaVerifier);
      } catch (error) {
        console.error('Recaptcha setup error:', error);
        setError('Failed to setup authentication');
      }
    };

    setupRecaptcha();

    return () => {
      recaptchaVerifier?.clear();
    };
  }, []);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError('');
    });
    if (!confirmationResult) {
      setError('please request Otp');
      return;
    }

    try {
      await confirmationResult?.confirm(otp);
      router.replace('/');
    } catch (error) {
      setError('Failed to verify OTP. Please check the otp');
    }
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountdown(60);

    startTransition(async () => {
      setError('');
      if (!recaptchaVerifier) {
        return setError('Recaptcha verifier is not initialized');
      }

      try {
        const fullPhoneNumber = `+${phoneNumber}`;
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmationResult);

        console.log(confirmationResult);

        setSuccess('OTP sent successfully');
      } catch (err: any) {
        console.log(err);
        console.error('Detailed error', {
          code: err.code,
          message: err.message,
          name: err.name,
        });
        setResendCountdown(0);

        if (err.code === 'auth/invalid-phone-number') {
          setError('Invalid Phone number');
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too many requests, Please try again later');
        } else {
          setError('Failed to send Otp');
        }
      }
    });
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input
            className='text-slate-700 text-md'
            type='tel'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className='text-xs text-gray-400 mt-3'>
            Please enter your number with the country code(i.e. 91 for India)
          </p>
        </form>
      )}
      {confirmationResult && (
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )}
      <Button
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => requestOtp()}
        className='mt-5 bg-purple-700 hover:scale-95 hover:bg-purple-500 hoer:text-back'>
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}`
          : isPending
          ? 'Sending OTP'
          : 'Send OTP'}
      </Button>
      <div className='p-10 text-center'>
        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>{success}</p>}
      </div>
      <div id='recaptcha-container'></div>
      {isPending && <LoaderIcon />}
    </div>
  );
}

export default OtpLogin;
