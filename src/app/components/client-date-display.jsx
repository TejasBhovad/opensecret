"use client";

import { formatDateString } from "@/lib/utils/date";

export function ClientDateDisplay({ date }) {
  return <>{formatDateString(date)}</>;
}
