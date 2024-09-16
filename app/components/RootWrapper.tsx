import { Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMobile } from "~/hooks/useMobile";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();
  const { height } = useViewportSize();

  return (
    <Flex h={`${height}px`} direction={isMobile ? "column" : "row"}>
      {children}
    </Flex>
  );
}
