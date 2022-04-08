// cf. https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/

export const asyncForEach = async <K>(
  arr: K[],
  predicate: (value: K, index: number, array: K[]) => Promise<boolean>
) => await Promise.all(arr.map(predicate));

export const asyncFilter = async <K>(
  arr: K[],
  predicate: (value: K, index: number, array: K[]) => Promise<boolean>
) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};
