export const sortKeysByValue = (
  object: Record<string, number>
): Record<string, number> => {
  return Object.entries(object)
    .sort(([, firstValue], [, secondValue]) => secondValue - firstValue)
    .reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: value,
      }),
      {}
    );
};

export const getPercentage = (
  partialValue: number,
  totalValue: number
): string => {
  const percentage = (partialValue / totalValue) * 100;
  if (percentage < 1) {
    return "< 1%";
  } else {
    return `${Math.floor(percentage)}%`;
  }
};
