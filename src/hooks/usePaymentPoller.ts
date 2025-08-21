import { useEffect, useState } from 'react';
import { getTxStatus } from '../api/payments';

export type PaymentStatus = 'Idle' | 'Pending' | 'Paid' | 'Failed' | 'Timeout';

interface Options {
  intervalMs?: number;
  timeoutMs?: number;
}

export function usePaymentPoller(
  txId?: number,
  { intervalMs = 3000, timeoutMs = 120000 }: Options = {},
): PaymentStatus {
  const [status, setStatus] = useState<PaymentStatus>('Idle');

  useEffect(() => {
    if (!txId) {
      setStatus('Idle');
      return;
    }

    let active = true;
    const start = Date.now();

    const poll = async () => {
      if (!active) return;
      try {
        const data = await getTxStatus(txId);
        const currentStatus = data.status as PaymentStatus;
        if (currentStatus === 'Pending') {
          if (Date.now() - start >= timeoutMs) {
            setStatus('Timeout');
            return;
          }
          setStatus('Pending');
          setTimeout(poll, intervalMs);
        } else {
          setStatus(currentStatus === 'Paid' ? 'Paid' : 'Failed');
        }
      } catch (error) {
        console.error('Polling error:', error);
        setStatus('Failed');
      }
    };

    poll();

    return () => {
      active = false;
    };
  }, [txId, intervalMs, timeoutMs]);

  return status;
}

export default usePaymentPoller;
