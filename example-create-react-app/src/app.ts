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
