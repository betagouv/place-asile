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
