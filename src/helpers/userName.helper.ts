import { generateRandomNumber } from "./randomNumber";
export const generateUserName = (name: string) => {
  const cleanedName = name.replace(/\s/g, "");
  const randomNum = generateRandomNumber(3);
  return `${cleanedName}${randomNum}`;
};
