import { z } from "zod";

export enum TimeInString {
  FIFTEEN_SECONDS = "15s",
  THIRTY_SECONDS = "30s",
  ONE_MINUTE = "1m",
  TWO_MINUTES = "2m",
  FIVE_MINUTES = "5m",
  TEN_MINUTES = "10m",
  FIFTEEN_MINUTES = "15m",
  THIRTY_MINUTES = "30m",
  ONE_HOUR = "1h",
  TWO_HOURS = "2h",
  ONE_DAY = "1d",
  ONE_WEEK = "7d",
  ONE_MONTH = "30d",
}

export const timeInStringSchema = z.nativeEnum(TimeInString);
