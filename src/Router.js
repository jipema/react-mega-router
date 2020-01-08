import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { HistoryProvider, HistoryContext } from './HistoryProvider';
import { Route } from './Route';
import { getMatchingRoutes } from './utils';

/** Automatically wrap HistoryProvider around Router if missing */
export function Router(props) {
   const routerProps = { ...props };
   delete routerProps.historyParams;
   delete routerProps.children;

   const routerComponent = <RouterRaw {...routerProps} router={props} />;
   const ctxt = useContext(HistoryContext);
   if (ctxt && ctxt.history && ctxt.history.listen) return routerComponent;

   return <HistoryProvider {...props.historyParams}>{routerComponent}</HistoryProvider>;
}
export default Router;
Router.propTypes = {
   routes: PropTypes.array.isRequired,
   cols: PropTypes.number,
   onEnter: PropTypes.func,
   onLeave: PropTypes.func,
   animate: PropTypes.bool,
   notFound: PropTypes.node,
   historyParams: PropTypes.object
};

function RouterRaw({ history: historyProp, routes, routesExtraProps, onEnter, onLeave, cols, path, animate, notFound, router }) {
   const { history: historyContext } = useContext(HistoryContext);
   const history = historyProp || historyContext;
   const historyPath = history && history.location && history.location.pathname;
   const [currentPath, setCurrentPath] = useState(historyPath);
   const previousMatches = useRef([]);

   const forcedPath = path || currentPath;

   useEffect(() => {
      if (!history || !history.listen) return;
      console.log('[router] mount', historyPath, history);

      //onLeave hook for blocking navigation
      history.onLeave = async () => {
         const onLeaveHandler = history.onLeaveHook || (previousMatches && previousMatches.current && previousMatches.current && previousMatches.current[0] && previousMatches.current[0].onLeave) || onLeave;
         let confirm;
         //for strings, show a confirm dialog
         if (typeof onLeaveHandler === typeof 's') {
            confirm = window && window.confirm ? window.confirm(onLeaveHandler) : true;

            //for functions, await result
         } else if (typeof onLeaveHandler === typeof Router) {
            confirm = await onLeaveHandler(previousMatches && previousMatches.current && previousMatches.current[0], history);

            if (typeof confirm === typeof 's') {
               confirm = window && window.confirm ? window.confirm(confirm) : true;
            }

            //else use raw value
         } else {
            confirm = onLeaveHandler;
         }

         //if leaving, remove hook
         if (confirm) delete history.onLeaveHook; //clear hook
         return confirm;
      };

      //watch location change
      const onHistoryUpdate = (location, action) => {
         if (!location || !location.pathname) return;
         history.stack.unshift(location);
         history.stack = history.stack.slice(0, 99);
         setCurrentPath(location.pathname);

         const currentRoute = previousMatches && previousMatches.current && previousMatches.current[0];

         if (typeof onEnter === typeof useEffect) {
            onEnter(currentRoute, history, action, location);
         }

         if (currentRoute && typeof currentRoute.onEnter === typeof useEffect) {
            currentRoute.onEnter(currentRoute, history, action, location);
         }
      };
      const unlisten = history.listen(onHistoryUpdate);

      //init mounting location
      onHistoryUpdate(history.location, 'init');

      return () => {
         console.log('[router] unmount', unlisten, history);
         if (typeof unlisten === typeof useEffect) unlisten();
      };
   }, [history]); // eslint-disable-line react-hooks/exhaustive-deps

   //history is required to keep going
   if (!history || !history.location) return null;

   const matchesRaw = getMatchingRoutes(routes, forcedPath) || [];
   let lastRouteCols = matchesRaw && matchesRaw[0] && matchesRaw[0].cols;
   if (typeof lastRouteCols === typeof RouterRaw) {
      lastRouteCols = lastRouteCols(routesExtraProps, cols, path, router);
   }
   const matches = matchesRaw.slice(0, lastRouteCols || cols || 1).reverse();

   //not found
   if (!matches || !matches.length) {
      delete history.onLeaveHook; //clear hook
      previousMatches.current = matchesRaw; //save empty matches

      if (!notFound) return null;
      if (animate === false) {
         return notFound;
      }
      return (
         <Route className="not-found" animation="navigate" direction="same" col={0} cols={1} path={forcedPath}>
            {notFound}
         </Route>
      );
   }

   //redirect
   if (matches[0].redirect) {
      delete history.onLeaveHook; //clear hook
      previousMatches.current = matchesRaw; //save empty matches
      history.push(matches[0].redirect);
      return null;
   }

   //animation: backward/forward/same for route tree traversing
   let animationDirection = (history.stack && history.stack[0] && history.stack[0].state && history.stack[0].state.animationDirection) || undefined;
   if (!animationDirection && matchesRaw && matchesRaw.length && previousMatches && previousMatches.current && previousMatches.current.length) {
      if (previousMatches.current[0].path === matchesRaw[0].path) {
         animationDirection = 'same';
      }

      if (!animationDirection) {
         for (let i in previousMatches.current) {
            if (previousMatches.current[i].path === matchesRaw[0].path) {
               animationDirection = 'backward';
               break;
            }
         }
      }

      if (!animationDirection) {
         for (let i in matchesRaw) {
            if (matchesRaw[i].path === previousMatches.current[0].path) {
               animationDirection = 'forward';
               break;
            }
         }
      }
   }

   //build jsx
   const validMatches = [];
   for (let i in matches) {
      if (!matches[i] || !matches[i].path || !matches[i].component) continue;
      validMatches.push(matches[i]);
   }
   const routeList = [];
   for (let i in validMatches) {
      const route = validMatches[i];
      const props = { ...route };
      delete props.component;

      const RouteComponent = route && route.path && route.component;
      if (!RouteComponent) continue;

      const col = validMatches.length - 1 - i;

      const ComponentInstance = <RouteComponent key={route.id || route.path} {...props} col={col} cols={validMatches.length} history={history} router={router} {...routesExtraProps} />;
      if (animate === false) {
         routeList.push(ComponentInstance);
         break;
      }

      const animationType = (history.stack && history.stack[0] && history.stack[0].state && history.stack[0].state.animationType) || (animationDirection ? 'navigate' : undefined);

      routeList.push(
         <Route
            key={'animation-' + col + '-' + route.path}
            path={route.path}
            url={route.url}
            col={col}
            cols={validMatches.length}
            className={route.className}
            animation={animationType}
            direction={animationDirection}
            animationDuration={route.animationDuration}
            animationInitDuration={route.animationInitDuration}
         >
            {ComponentInstance}
         </Route>
      );

      if (route.cols && routeList >= route.cols) break;
   }
   previousMatches.current = matchesRaw;

   return <React.Fragment>{routeList}</React.Fragment>;
}
RouterRaw.propTypes = {
   routes: PropTypes.array.isRequired,
   cols: PropTypes.number,
   onEnter: PropTypes.func,
   onLeave: PropTypes.func,
   animate: PropTypes.bool,
   notFound: PropTypes.node
};
