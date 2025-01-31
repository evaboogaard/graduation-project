export const toISODate = (value) => {
  const dateObject = new Date(value);

  return dateObject.toISOString();
};
