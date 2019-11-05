import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';

export const HistoryContext = React.createContext([]);

export function HistoryProvider({ children, hash, memory, options, basePath, getUserConfirmation }) {
   const [history, setHistory] = useState({});
   const historyRef = useRef();

   useEffect(() => {
      let createHistory = createBrowserHistory;
      if (hash) createHistory = createHashHistory;
      else if (memory) createHistory = createMemoryHistory;

      const historyParams = {
         ...options,
         basename: basePath || '',
         getUserConfirmation:
            getUserConfirmation ||
            async function(message, callback) {
               const hookRes = typeof historyRef.current.onLeave === typeof HistoryProvider ? await historyRef.current.onLeave(history.location) : true;
               if (hookRes) delete historyRef.current.onLeaveHook; //clear hook
               return callback(hookRes === false ? false : true);
            }
      };

      const history = createHistory(historyParams);
      history.block('default');
      history.stack = []; //append stack to history

      historyRef.current = history;
      setHistory(history);
   }, [basePath, getUserConfirmation, hash, memory, options]);

   if (!history) return null;
   return <HistoryContext.Provider value={{ history, basePath }}>{children}</HistoryContext.Provider>;
}
HistoryProvider.propTypes = {
   children: PropTypes.node,
   basePath: PropTypes.string,
   hash: PropTypes.bool,
   memory: PropTypes.bool,
   options: PropTypes.object,
   getUserConfirmation: PropTypes.func
};