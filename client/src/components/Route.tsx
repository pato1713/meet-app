import React, { useContext } from "react";
import { RoutingContext } from "../providers/RoutingProvider";

const Route: React.FC<React.PropsWithChildren<{ path: string }>> = ({
  children,
  path,
}) => {
  const routingContext = useContext(RoutingContext);

  if (routingContext.currentPath === path) return <>{children}</>;
  else return null;
};

export default Route;
