import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export function useRouteSync() {
  const location = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    window.parent.postMessage(
      {
        type: "ROUTE_CHANGE",
        path: location.pathname,
      },
      "*"
    );
  }, [location.pathname]);
}
