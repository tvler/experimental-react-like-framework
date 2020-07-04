import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { FrameworkHost } from "./Framework";
import root from "./root";

ReactDOM.render(
  React.createElement(FrameworkHost, { root }),
  document.getElementById("root")
);
