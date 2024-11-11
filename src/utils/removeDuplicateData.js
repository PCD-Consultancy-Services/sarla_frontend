export const removeDuplicates = (array, key) => {
  return [...new Map(array.map((item) => [item[key]?._id, item])).values()];
};
