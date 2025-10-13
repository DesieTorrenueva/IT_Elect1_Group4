import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Kuyazap/Home";
import HardLevel from "./Kuyazap/HardLevel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hard" element={<HardLevel />} />
    </Routes>
  );
}
