import { useMobile } from "~/hooks/useMobile";
import { LeftNavigation } from "./LeftNavigation";
import { TopNavigation } from "./TopNavigation";

export function Navigation() {
  const isMobile = useMobile();

  return !isMobile ? <LeftNavigation /> : <TopNavigation />;
}
