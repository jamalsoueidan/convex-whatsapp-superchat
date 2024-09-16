import { Drawer, DrawerProps, Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export const CustomDrawer = ({
  children,
  onClose,
  opened,
}: { children: React.ReactNode } & DrawerProps) => {
  const { height } = useViewportSize();

  return (
    <Drawer.Root
      position="right"
      size="100%"
      opened={opened}
      onClose={onClose}
      lockScroll={false} //fix mobile infinity scroll
    >
      <Drawer.Content>
        <Drawer.Body p="0">
          <Flex direction="column" h={`${height}px`}>
            {children}
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};
