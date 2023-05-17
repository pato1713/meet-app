import React, { useCallback, useEffect, useState } from "react";

interface IRoutingContext {
  currentPath: string;
  navigate: (path: string) => void;
}

export const RoutingContext = React.createContext<IRoutingContext>(null);

const RoutingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const popstateHandler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", popstateHandler);

    return () => {
      window.removeEventListener("popstate", popstateHandler);
    };
  }, []);

  const navigate = useCallback((pathname: string) => {
    setCurrentPath(pathname);
    window.history.pushState(null, null, pathname);
  }, []);

  return (
    <RoutingContext.Provider
      value={{
        currentPath: currentPath,
        navigate: navigate,
      }}
    >
      {children}
    </RoutingContext.Provider>
  );
};

export default RoutingProvider;
