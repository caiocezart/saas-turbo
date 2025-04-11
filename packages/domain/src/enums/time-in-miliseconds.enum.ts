import { z } from "zod";

export enum TimeInMilliseconds {
  FIFTEEN_SECONDS = 15 * 1000,
  THIRTY_SECONDS = 30 * 1000,
  ONE_MINUTE = 1 * 60 * 1000,
  TWO_MINUTES = 2 * 60 * 1000,
  FIVE_MINUTES = 5 * 60 * 1000,
  TEN_MINUTES = 10 * 60 * 1000,
  FIFTEEN_MINUTES = 15 * 60 * 1000,
  THIRTY_MINUTES = 30 * 60 * 1000,
  ONE_HOUR = 60 * 60 * 1000,
  TWO_HOURS = 120 * 60 * 1000,
  ONE_DAY = 24 * 60 * 60 * 1000,
  ONE_WEEK = 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH = 30 * 24 * 60 * 60 * 1000,
}

export const timeInMillisecondsSchema = z.nativeEnum(TimeInMilliseconds);
