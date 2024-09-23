import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useMemo } from "react";

dayjs.extend(duration);

export const useRemainingTime = ({
  incoming_timestamp,
}: {
  incoming_timestamp?: number;
}) => {
  const remainingDuration = useMemo(() => {
    if (!incoming_timestamp) {
      return null;
    }

    const timestamp = dayjs(incoming_timestamp * 1000);
    const targetTime = timestamp.add(24, "hour");
    const timeLeft = targetTime.diff(dayjs());
    const remainingDuration = dayjs.duration(timeLeft);
    if (remainingDuration.asMilliseconds() <= 0) {
      return null;
    }
    return remainingDuration;
  }, [incoming_timestamp]);

  return remainingDuration;
};
