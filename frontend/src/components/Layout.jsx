// src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const location = useLocation();

  // Rutas donde NO queremos mostrar el menú
  const ocultarMenuEn = [
    "/paneladmin",
    "/panelempleado",
    "/perfilcliente",
    "/login",
    "/registro"
  ];

  const ocultarMenu = ocultarMenuEn.includes(location.pathname);

  return (
    <>
      {!ocultarMenu && <Navbar />}
      <Outlet />
    </>
  );
}
