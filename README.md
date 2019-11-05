# React Mega Router 🛣🛣🛣

Yet another React router. But this one has multi-columns and animations built-in.

## Demo

[Try it](https://9uso1.csb.app/)
[Play with it](https://codesandbox.io/s/react-mega-router-9uso1)

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

| Property | Type          | Required | Description                                                                                  |
| :------- | :------------ | :------- | :------------------------------------------------------------------------------------------- |
| routes   | array         | true     | Routes list [{ path: '/foo/bar', component: MyComponent, routes: [], anyOtherProps: true }]  |
| cols     | integer       | false    | Number of visible columns (typically 2)                                                      |
| onUpdate | function      | false    | Triggered on route change (location, action, stack)=>{}                                      |
| onLeave  | function      | false    | Triggered on route leave (async), returns false to deny navigation                           |
| animate  | boolean       | false    | False to disable animation className (direction-forward, direction-backward, direction-same) |
| notFound | React Element | false    | Not found route fallback                                                                     |

## Props passed to each visible route components

| Property   | Type    | Description                |
| :--------- | :------ | :------------------------- |
| history    | history | History object             |
| col        | integer | Current column             |
| cols       | integer | Columns count              |
| path       | string  | Current path               |
| router     | object  | Router props               |
| {...route} | -       | Any other route attributes |

## Animations

Each route will be passed animation classNames, so you can make 'em look good: `will-enter`, `entering`, `direction-forward`, `direction-backward`, `direction-same`, `col-1`, `col-2`, `cols-2`, ...

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
