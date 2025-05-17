import { getPaymentInfo } from '@/actions/user';
import React from 'react';

type Props = {
  params: Promise<{
    workspaceId: string;
  }>;
};

const BillingPage = async ({ params }: Props) => {
  const payment = await getPaymentInfo();

  return (
    <div className="bg-[#1d1d1d] flex flex-col gap-y-8 p-6 rounded-xl shadow-md">
      {/* Current Plan Section */}
      <div>
        <h2 className="text-white text-2xl font-semibold">Current Plan</h2>
        <p className="text-[#9d9d9d] text-sm mt-1">
          Your payment history
        </p>
      </div>

      {/* Plan Details Section */}
      <div>
        <h2 className="text-white text-3xl font-bold">
          ${payment?.data?.subscription?.plan === 'PRO' ? '40' : '0'}/Month
        </h2>
        <p className="text-[#9d9d9d] text-sm capitalize mt-1">
          {payment?.data?.subscription?.plan} Plan
        </p>
      </div>
    </div>
  );
};

export default BillingPage;