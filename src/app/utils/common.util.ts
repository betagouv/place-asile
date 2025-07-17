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

export const computeAverage = (array: number[]): number => {
  if (array.length === 0) {
    return 0;
  }
  return (
    array.reduce(
      (firstElement, secondElement) => firstElement + secondElement
    ) / array.length
  );
};

// TODO: test this function
export const reverseObjectKeyValues = (
  objectToReverse: Record<string | number, string | number>
) => {
  const reversedObject: Record<string | number, string | number> = {};
  for (const key in objectToReverse) {
    reversedObject[objectToReverse[key]] = key;
  }
  return reversedObject;
};

// TODO: test this function
export const convertObjectToArray = (
  objectToConvert: Record<string | number, string | number>
) => {
  const convertedArray = [];
  for (const key in objectToConvert) {
    convertedArray.push(objectToConvert[key]);
  }
  return convertedArray;
};
