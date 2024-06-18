import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Calculator from "./Calculator";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/" element={<Calculator />}></Route>
          <Route path="ttt" element={<App />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
