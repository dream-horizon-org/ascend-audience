import { useEffect } from "react";
import { useLocation } from "react-router";

export function useRouteSync() {
  const location = useLocation();
  
  useEffect(() => {
    window.parent.postMessage(
      {
        type: 'ROUTE_CHANGE',
        path: location.pathname // This should be '/create-audience', not '/'
      },
      'http://localhost:9000' // Your parent app URL
    );
  }, [location.pathname]);
  
  return null;
}
