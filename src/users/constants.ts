import { env } from 'process';

export const userConstants: { roundsOfHashing: number } = {
  roundsOfHashing: +env.ROUNDS_OF_HASHING,
};
