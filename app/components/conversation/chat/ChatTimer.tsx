import { Badge, Group, rem, Text } from "@mantine/core";
import { IconClockHour5 } from "@tabler/icons-react";
import { Duration } from "dayjs/plugin/duration";

export const ChatTimer = ({
  remainingDuration,
}: {
  remainingDuration: Duration | null;
}) => {
  return (
    <Badge variant="outline" p={rem(5)} color="gray.4" tt="unset" mt={rem(4)}>
      <Group gap="4px">
        {remainingDuration && (
          <IconClockHour5
            color="orange"
            stroke="1.4"
            style={{ width: rem(18), height: rem(18) }}
          />
        )}
        <Text fz="xs" c="gray.8">
          {remainingDuration
            ? `${remainingDuration?.format("HH:mm")}h`
            : "Expired"}
        </Text>
      </Group>
    </Badge>
  );
};
