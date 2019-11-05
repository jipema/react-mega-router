import UrlPattern from 'url-pattern';

/** utils */
export function getMatchingRoutes(routesSrc, path, maxTreeDepth = 32) {
   //list all routes
   const listRoutes = (src, list, parentId, maxTreeDepth, depth = 0) => {
      if (!src || depth >= maxTreeDepth) return list;
      list = list || {};
      for (let i in src) {
         if (!src[i].path || (!src[i].component && !src[i].redirect)) continue;
         const route = { ...src[i] };
         delete route.routes;
         route.parent = parentId;
         list[route.path] = route;

         if (src[i].routes) listRoutes(src[i].routes, list, route.path, maxTreeDepth, (depth || 0) + 1);
      }
      return list;
   };
   const routeList = listRoutes(routesSrc);

   //get current match
   let match;
   for (let routePath in routeList) {
      const pattern = new UrlPattern(routePath);
      const params = pattern.match(path);
      if (params) {
         match = { ...routeList[routePath] };
         match.params = params;
         break;
      }
   }
   if (!match) return;

   //prepare match & parent list
   let matches = [];
   const lastParams = match.params || {};
   while (match) {
      const pattern = match.path && new UrlPattern(match.path);
      match.url = match.url || (pattern && pattern.stringify(lastParams));
      match.params = match.params || pattern.match(match.url);
      const parentPattern = match.parent && new UrlPattern(match.parent);
      match.parentUrl = parentPattern && parentPattern.stringify(lastParams); 
      
      if(match.parent && match.parentUrl && routeList[match.parent] && !routeList[match.parent].url) routeList[match.parent].url = match.parentUrl;
      
      matches.push(match);
      match = match.parent && routeList[match.parent];
   }

   return matches;
}