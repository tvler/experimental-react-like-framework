# experimental-react-like-framework

## Bet: JSX is bad

JSX immediately requires a complex build environment. Differences between HTML is small but painful for beginners. Sebastian Markbåge (a lead react maintainer) tweeted that JSX is a bug.

<img width="426" src="https://user-images.githubusercontent.com/4934193/85815984-d5ace080-b71e-11ea-9231-8ee97584096b.png">

## Bet: React.createElement is bad

Using React without JSX forces you to use the React.createElement API. Building a complex template with React.createElement ends up as a deeply-nested function call with no breakpoints at the very bottom of your component code. JSX is an attempt to make this format more presentable, but it doesn't solve the underlying issue that your template is inside of a function call, with no access to if-statements, for-loops, etc.

## Bet: Code based off of execution-order is good

Facebook built hooks around execution-order and received major backlash by the engineering community, but resulted in few actual real-world problems.

## Result

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

## Benefits

Simpler code for loops and conditional rendering

Zero distinction between functions and components

Don’t have to learn JSX

No return statement

No need for closing tags

No need for fragments

## How it works

Each primitive HTML element function pings a global store when called. The order of the pings determines the order in which the actual HTML elements are rendered to the dom. This is the exact same architecture that Facebook has proven successful with react hooks.
