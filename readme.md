# experimental-react-like-framework

A new, experimental frontend for React inspired by SwiftUI. In development.

Based off of two big questions:

① What would React look like if execution-order-based code wasn't used only for hooks, but for all framework features?

② What would React look like if JSX never existed?

Hello World app:

```ts
const App = () => {
  h1(null, "Hello world!");
};
```

The framework is hosted on React itself. Designed to be incrementally adopted inside of a React subtree without interfering with any existing code.

```tsx
import { NewFramework } from "./NewFramework";
import { NewFrameworkApp } from "./NewFrameworkApp";

const App = () => (
  <YourExistingReactApp>
    <YourExistingReactComponent />

    {/* 🆕 */}
    <NewFramework root={NewFrameworkApp} />
  </YourReactApp>
);
```

## Table of contents

- [Framework write-up](#framework-write-up)
- [What I've built so far](#what-ive-built-so-far)
- [What needs to be built](#what-needs-to-be-built)

## Framework write-up

### Bet: JSX is bad

JSX immediately requires a complex build environment. Differences between HTML is small but painful for beginners. Sebastian Markbåge (a lead react maintainer) tweeted that JSX is a bug.

<img width="426" src="https://user-images.githubusercontent.com/4934193/85815984-d5ace080-b71e-11ea-9231-8ee97584096b.png">

### Bet: React.createElement is bad

Using React without JSX forces you to use the React.createElement API. Building a complex template with React.createElement ends up as a deeply-nested function call with no breakpoints at the very bottom of your component code. JSX is an attempt to make this format more presentable, but it doesn't solve the underlying issue that your template is inside of a function call, with no access to if-statements, for-loops, etc.

### Bet: Code based off of execution-order is good

Facebook built hooks around execution-order and received major backlash by the engineering community, but resulted in few actual real-world problems.

### Result

An exploration of what react would look like if execution-order-based code wasn’t considered an antipattern, and if JSX never existed.

```tsx
/*
 * New syntax
 */
const App = () => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter(counter + 1);
  };

  h1(null, "Hello world!");

  // A button with an onClick prop
  button({ onClick: handleClick }, counter);

  // An ordered list counting up from 0 to 9
  ol(null, () => {
    for (let i = 0; i < 10; i++) {
      li({ key: i }, i);
    }
  });

  // Conditionally rendering a span if counter is odd
  if (counter % 2) {
    span(null, "counter is an odd number.");
  }
};

/*
 * Old JSX syntax
 */
const JSXApp = () => {
  const [counter, setCounter] = useState(0);
  const handleClick = () => {
    setCounter(counter + 1);
  };

  return (
    <>
      <h1>Hello world!</h1>

      {/* A button with an onClick prop */}
      <button onClick={handleClick}>{counter}</button>

      {/* An ordered list counting up from 0 to 9 */}
      <ol>
        {Array.from({ length: 10 }, (_, i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>

      {/* Conditionally rendering a span if counter is odd */}
      {counter % 2 && <span>counter is an odd number.</span>}
    </>
  );
};
```

### Benefits

Simpler code for loops and conditional rendering

Zero distinction between functions and components

Don’t have to learn JSX

No return statement

No need for closing tags

No need for fragments

### How it works

Each primitive HTML element function pings a global store when called. The order of the pings determines the order in which the actual HTML elements are rendered to the dom. This is the exact same architecture that Facebook has proven successful with react hooks.

This has the potential to work directly within React itself, turning into a series of React.createElement calls on execution. Making this an experimental new frontend for React, with the added benefits of gradual adoption and an already-existing suite of developer tools to build off of.

## What I've built so far

### ✅ Working prototype

```
cd example-create-react-app
yarn
yarn start
```

### ✅ Everything except state

[example-create-react-app/src/app.ts](example-create-react-app/src/app.ts)

```ts
import { button, h1, ol, li } from "./Framework";

const app = () => {
  h1(null, "Hello world!");

  // A button with an onClick prop
  button(
    {
      onClick: () => {
        alert("clicked!");
      },
    },
    "Click"
  );

  // An ordered list counting up from 0 to 9
  ol(null, () => {
    for (let i = 0; i < 10; i++) {
      li(null, i);
    }
  });
};

export default app;
```

### ✅ Building on top of React

[example-create-react-app/src/index.ts](example-create-react-app/src/index.ts)

```ts
import React from "react";
import ReactDOM from "react-dom";
import { Framework } from "./Framework";
import app from "./app";

ReactDOM.render(
  React.createElement(Framework, { root: app }),
  document.getElementById("root")
);
```

## What needs to be built

- [ ] Multiple Framework hosts being rendered in a React tree
- [ ] State
