import { Flex } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { TeamList } from "~/components/team/TeamList";
import { useMobile } from "../hooks/useMobile";

export default function TeamPage() {
  const isMobile = useMobile();
  const users = useQuery(api.users.getAll);

  return (
    <>
      <Flex
        bg="white"
        flex={isMobile ? 1 : ".5"}
        direction="column"
        style={{ overflow: "hidden" }}
      >
        {users ? <TeamList users={users} /> : null}
      </Flex>
      <Outlet />
    </>
  );
}
