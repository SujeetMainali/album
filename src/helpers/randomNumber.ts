export const generateRandomNumber = (n: number): number => {
  return Math.floor(Math.random() * Math.pow(10, n));
};
