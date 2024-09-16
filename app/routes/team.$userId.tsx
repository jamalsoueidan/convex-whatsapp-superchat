import { noop } from "@mantine/core";
import { useParams } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { CustomDrawer } from "~/components/CustomDrawer";
import { TeamUserForm } from "~/components/team/TeamUserForm";
import { useMobile } from "~/hooks/useMobile";

export default function TeamPage() {
  const params = useParams();
  const isMobile = useMobile();
  const user = useQuery(api.users.get, {
    user: params.userId as Id<"users">,
  });

  const update = useMutation(api.users.update);

  if (!user) {
    return <></>;
  }

  return isMobile ? (
    <CustomDrawer onClose={noop} opened>
      <TeamUserForm user={user} update={update} />
    </CustomDrawer>
  ) : (
    <TeamUserForm user={user} update={update} />
  );
}
