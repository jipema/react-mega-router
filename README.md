# React Mega Router 🛣🛣🛣

Yet another React router. But this one has multi-columns, hooks and animations, built-in.

## Features

✅ Multi-columns _(`cols` prop)_ \
✅ Route leave async hook _(`onLeave` prop or `onLeave` route attribute)_ \
✅ Browser, Hash or Memory [history](https://www.npmjs.com/package/history) _(`memory`, `hash` and `historyParams` props)_ \
✅ Routes animation classNames: `will-enter`, `entering`, `direction-forward`, `direction-backward`, `direction-same`, `col-1`, `col-2`, `cols-2`, ... \

## Demo

👀 [Try it](https://9uso1.csb.app/)\
🛠 [Grill it](https://codesandbox.io/s/react-mega-router-9uso1)

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

## Proptypes

| Property | Type          | Required | Description                                                                                   |
| :------- | :------------ | :------- | :-------------------------------------------------------------------------------------------- |
| routes   | array         | true     | Routes list `[{ path: '/foo/bar', component: MyComponent, routes: [], anyOtherProps: true }]` |
| cols     | integer       | false    | Number of visible columns                                                                     |
| onEnter  | function      | false    | Triggered on route enter `(route, history, actionlocation, action, )=>{}`                     |
| onLeave  | function      | false    | Triggered on route leave `async (route, history)=>{}`, returns false to deny navigation       |
| animate  | boolean       | false    | False to disable animation classNames                                                         |
| notFound | React Element | false    | Not found route fallback                                                                      |

## Props passed to each visible route components

| Property   | Type    | Description                |
| :--------- | :------ | :------------------------- |
| history    | history | History object             |
| col        | integer | Current column             |
| cols       | integer | Columns count              |
| path       | string  | Current path               |
| router     | object  | Router props               |
| {...route} | -       | Any other route attributes |

## Advanced Usage: external navigation Links

To avoid page refresh, Link components should be within the HistoryProvider.

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
