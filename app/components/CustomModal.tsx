import { ActionIcon, Modal, ModalProps } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

import { Link } from "@remix-run/react";
import { useMobile } from "../hooks/useMobile";

export function CustomModal({
  children,
  back,
  ...props
}: ModalProps & { back?: string }) {
  const isMobile = useMobile();

  return (
    <Modal.Root size="xl" {...props} fullScreen={isMobile}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          {props.title ? <Modal.Title>{props.title}</Modal.Title> : null}
          {back ? (
            <ActionIcon
              component={Link}
              to={back}
              variant="transparent"
              color="#666"
            >
              <IconArrowLeft stroke="1.5" />
            </ActionIcon>
          ) : null}
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
