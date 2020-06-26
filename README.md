# experimental-react-like-framework

**Bet:** JSX is bad. 

JSX immediately requires a complex build environment. Differences between HTML is small but painful for beginners. Sebastian Markbåge (a lead react maintainer) tweeted that JSX is a bug.

<img width="426" src="https://user-images.githubusercontent.com/4934193/85815984-d5ace080-b71e-11ea-9231-8ee97584096b.png">

**Bet:** Code based off of insertion-order is good. 

Facebook built hooks around insertion-order and received major backlash by the engineering community, but resulted in few actual real-world problems.

**Result:**

An exploration of what react would look like if insertion-order-based code wasn’t considered an antipattern, and if JSX never existed.

<img width="552" alt="export const App = O = •" src="https://user-images.githubusercontent.com/4934193/85816053-08ef6f80-b71f-11ea-9851-3457e288805a.png">

Collocation of business logic and UI (useState is below an h1 element).
Simpler code for loops and conditional rendering.
Zero distinction between functions and components. 
Props don’t have to be objects.
Don’t have to learn JSX.
No return statement.
No need for closing tags.

**How it works**

Each primitive HTML element function pings a global store when called. The order of the pings determines the order in which the actual HTML elements are rendered to the dom. This is the exact same architecture that Facebook has proven successful with react hooks.
