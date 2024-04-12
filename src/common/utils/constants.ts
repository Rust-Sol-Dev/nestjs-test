import { IsStrongPasswordOptions } from "class-validator";

export const USERNAME_MIN_SIZE = 2;
export const USERNAME_MAX_SIZE = 20;

export const PASSWORD_OPTIONS: IsStrongPasswordOptions = {
  minSymbols: 0,
  minLength: 8,
};
