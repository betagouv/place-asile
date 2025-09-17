/**
 * Displays a number as formatted French currency (EUR).
 * @param value - The number to display as currency
 * @param className - Optional CSS class for the span
 * @param showZero - If false, displays "-" for zero/null/undefined values
 */

import { formatCurrency } from "@/app/utils/number.util";

export const CurrencyDisplay = ({
  value,
  className = "",
  showZero = true,
}: CurrencyDisplayProps) => {
  if (!showZero && (value === 0 || value === null || value === undefined)) {
    return <span className={className}>-</span>;
  }

  return <span className={className}>{formatCurrency(value)}</span>;
};

type CurrencyDisplayProps = {
  value: number | null | undefined;
  className?: string;
  showZero?: boolean;
};
