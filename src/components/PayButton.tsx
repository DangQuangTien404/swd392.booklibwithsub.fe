import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { checkout } from '../api/payments';
import usePaymentPoller from '../hooks/usePaymentPoller';

interface PayButtonProps {
  subscriptionId: number;
  amount: number;
  onPaid?: () => void;
}

const PayButton: React.FC<PayButtonProps> = ({ subscriptionId, amount, onPaid }) => {
  const [txId, setTxId] = useState<number | undefined>();
  const status = usePaymentPoller(txId);

  useEffect(() => {
    if (status === 'Paid') {
      onPaid?.();
    }
  }, [status, onPaid]);

  const handlePay = async () => {
    const payWin = window.open('', '_blank');
    try {
      const { txId, payUrl } = await checkout(subscriptionId, amount);
      setTxId(txId);
      if (payWin) {
        payWin.location.href = payUrl;
      }
    } catch (error) {
      payWin?.close();
      console.error('Checkout error:', error);
      message.error('Không thể khởi tạo thanh toán');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handlePay}>
        Thanh toán
      </Button>
      {txId && <div>Trạng thái: {status}</div>}
    </div>
  );
};

export default PayButton;
