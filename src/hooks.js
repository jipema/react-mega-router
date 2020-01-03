import { useState, useEffect } from 'react';

export function useRouteOnLeave(hookAction, routerHistory) {
   useEffect(() => {
      if (hookAction === undefined || !routerHistory || !routerHistory.location) return;
      console.log('[router.useRouteOnLeave] SET', hookAction, routerHistory);

      routerHistory.onLeaveHook = hookAction;
      return () => {
         console.log('[router.useRouteOnLeave] UNSET', hookAction, routerHistory);
         delete routerHistory.onLeaveHook; //clear hook
      };
   });
}
export function useActivePath(path, routerHistory, exact) {
   const [active, setActive] = useState(false);

   useEffect(() => {
      if (!path || !routerHistory || !routerHistory.listen) return;

      //listen for new path
      const unlisten = routerHistory.listen((location, action) => {
         setActive(pathIsActive(path, location.pathname, exact));
      });

      //initial mount state
      setActive(pathIsActive(path, routerHistory && routerHistory.location && routerHistory.location.pathname, exact));

      //unlisten on unmout
      return () => {
         if (typeof unlisten === typeof useActivePath) return unlisten();
      };
   }, [path, routerHistory]); // eslint-disable-line react-hooks/exhaustive-deps

   return active;
}

export function pathIsActive(linkpath, currentPath, exact) {
   let result;
   if (linkpath && currentPath) {
      if (linkpath === currentPath) {
         result = true;
      } else if (linkpath === '/' || exact) {
         result = currentPath === linkpath;
      } else {
         result = currentPath.indexOf(linkpath + '/') === 0;
      }
   }
   return result || false;
}