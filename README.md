# 🛣🛣 React Mega Router 🛣🛣

Yet another React router. But this one has multi-columns, hooks and animations, built-in.

## Features

✅ Multi-columns, aka nested side-by-side routes _(`cols` prop)_ \
✅ Enter hook _(`onEnter` prop or `onEnter` route attribute)_ \
✅ Leave async blockable hook _(`onLeave` prop or `onLeave` route attribute)_ \
✅ Browser, Hash or Memory [history](https://www.npmjs.com/package/history) _(`memory`, `hash` and `historyParams` props)_ \
✅ Animation classNames: `will-enter`, `entering`, `direction-forward`, `direction-backward`, `direction-same`, `col-1`, `col-2`, `cols-2`, ... \
✅ Link component with automatic `active` className

## Demo

👀 [Try it](https://9uso1.csb.app/)\
🛠 [Grill it](https://codesandbox.io/s/react-mega-router-9uso1) 🔨

## Install

Via [NPM](https://docs.npmjs.com/):

```bash
npm install react-mega-router --save
```

Via [Yarn](https://yarnpkg.com/en/):

```bash
yarn add react-mega-router
```

## Basic Usage

```javascript
import Router from 'react-mega-router';
import { PageFoo, PageBar, PageMoien } from './pages';

const demoRoutes = [
   {
      path: '/foo',
      component: PageFoo,
      onEnter: (route, history, action) => console.log('Just entered!'),
      onLeave: (route, history) => console.log('Should I block the navigation?'),
      routes: [
         {
            path: '/foo/:bar',
            component: PageBar
         }
      ]
   },
   {
      path: '/moien',
      component: PageMoien
   }
];

const App = (props) => {
   return <Router routes={demoRoutes} cols={2} />;
};
```

## Router props

| Property      | Type          | Required | Description                                                                                     |
| :------------ | :------------ | :------- | :---------------------------------------------------------------------------------------------- |
| routes        | array         | true     | Array of `Route` _(details below)_                                                              |
| cols          | integer       | false    | Number of visible columns                                                                       |
| onEnter       | function      | false    | Triggered by (any) route entering `(route, history, actionlocation, action, )=>{}`              |
| onLeave       | function      | false    | Triggered by (any) route leaving `async (route, history)=>{}`, returns false to deny navigation |
| animate       | boolean       | false    | False to disable animation classNames                                                           |
| path          | string        | false    | Forced router path, ignoring history                                                            |
| notFound      | react element | false    | Not found route fallback                                                                        |
| memory        | boolean       | false    | use memoryHistory instead of browserHistory                                                     |
| hash          | boolean       | false    | use hashHistory instead of browserHistory                                                       |
| historyParams | object        | false    | pass params to createHistory                                                                    |

## Route attributes

| Property  | Type            | Required | Description                                                                                |
| :-------- | :-------------- | :------- | :----------------------------------------------------------------------------------------- |
| path      | string          | true     | path ([url-pattern](https://www.npmjs.com/package/url-pattern) format)                     |
| component | React Component | true     | Number of visible columns                                                                  |
| routes    | array           | false    | Sub routes                                                                                 |
| onEnter   | function        | false    | Triggered by route entering                                                                |
| onLeave   | function        | false    | Triggered by route leaving `async (route, history)=>{}`, returns false to block navigation |
| animation | string          | false    | Animation className, false to disabled                                                     |
| {...}     | -               | false    | Any other props that needs to be passed to component                                       |

## Route component passed props

| Property | Type    | Description                |
| :------- | :------ | :------------------------- |
| history  | history | History object             |
| col      | integer | Current column             |
| cols     | integer | Columns count              |
| path     | string  | Current path               |
| router   | object  | Router props               |
| {...}    | -       | Any other route attributes |

## Advanced Usage: external navigation Links

The history can be externalized using `HistoryProvider`. \
This can be useful to use Link components outside of the Router:

```javascript
import Router, { HistoryProvider, Link } from 'react-mega-router';

//const demoRoutes = ...

const App = (props) => {
   return (
      <HistoryProvider>
         <Router routes={demoRoutes} cols={2} />
         <nav>
            <Link href="/route1">Route 1</Link>
            <Link href="/route1/foobar">Route 1 sub</Link>
         </nav>
      </HistoryProvider>
   );
};
```
