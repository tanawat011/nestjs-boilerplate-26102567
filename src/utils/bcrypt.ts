import { hash, compare } from 'bcrypt';

export const bcryptHash = async (str: string) => {
  const saltOrRounds = 10;
  return hash(str, saltOrRounds);
};

export const bcryptCheck = async (str: string, hash: string) => {
  return compare(str, hash);
};
