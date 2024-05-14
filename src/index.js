import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Calculator from "./Calculator";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="calc" element={<Calculator />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
