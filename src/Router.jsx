import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/public/Home";

export default function Router() {
  const handleOpenAuth = (mode) => {
    console.log(`Abrir autenticação: ${mode}`);
  };

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}
