import { a, h1, div, span } from "./Framework";

export default () => {
  h1({}, 1);

  span(null, "2");

  div(null, () => {
    div(null, () => {
      h1(null, "3");
    });
    span(null, "test");
  });

  a({ href: "https://www.tylerdeitz.com/" }, "Click");
};
