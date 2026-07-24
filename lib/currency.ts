export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
