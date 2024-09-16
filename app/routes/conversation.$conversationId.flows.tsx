import { Outlet, useLocation, useNavigate, useParams } from "@remix-run/react";
import { CustomModal } from "~/components/CustomModal";

export default function ConversationFlows() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return (
    <CustomModal
      opened={true}
      onClose={() => navigate(`/conversation/${params?.conversationId}`)}
      back={
        location.pathname.includes("preview") ||
        location.pathname.includes("send")
          ? "./"
          : undefined
      }
    >
      <Outlet />
    </CustomModal>
  );
}
