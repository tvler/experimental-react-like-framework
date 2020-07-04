import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Framework } from "./Framework";
import app from "./app";

ReactDOM.render(
  React.createElement(Framework, { root: app }),
  document.getElementById("root")
);
