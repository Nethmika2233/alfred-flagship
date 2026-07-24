"use client";

import { useState, useTransition } from "react";
import type { FulfillmentStatus, PaymentStatus } from "@prisma/client";

export const FULFILLMENT_OPTIONS: FulfillmentStatus[] = [
  "UNFULFILLED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const PAYMENT_OPTIONS: PaymentStatus[] = ["PENDING", "PAID", "FAILED"];

function StatusSelect<T extends string>({
  orderId,
  value,
  options,
  action,
}: {
  orderId: string;
  value: T;
  options: T[];
  action: (orderId: string, status: T) => Promise<{ error?: string }>;
}) {
  const [current, setCurrent] = useState(value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleChange = (next: T) => {
    setCurrent(next);
    setError(undefined);
    startTransition(async () => {
      const result = await action(orderId, next);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div>
      <select
        value={current}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as T)}
        className="border border-zinc-200 text-[10px] uppercase tracking-widest px-2 py-1.5 bg-white focus:outline-none focus:border-black disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-[9px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FulfillmentStatusSelect({
  orderId,
  value,
  action,
}: {
  orderId: string;
  value: FulfillmentStatus;
  action: (orderId: string, status: FulfillmentStatus) => Promise<{ error?: string }>;
}) {
  return <StatusSelect orderId={orderId} value={value} options={FULFILLMENT_OPTIONS} action={action} />;
}

export function PaymentStatusSelect({
  orderId,
  value,
  action,
}: {
  orderId: string;
  value: PaymentStatus;
  action: (orderId: string, status: PaymentStatus) => Promise<{ error?: string }>;
}) {
  return <StatusSelect orderId={orderId} value={value} options={PAYMENT_OPTIONS} action={action} />;
}
