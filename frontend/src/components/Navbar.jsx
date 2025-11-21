// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pill } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // Si es empleado o cliente logueado, no mostrar navbar
  if (token && (usuario.rol === "empleado" || usuario.rol === "cliente")) {
    return null;
  }

  return (
    <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo y nombre */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <Pill size={24} className="text-pink-300" />
        Droguería MIMS
      </div>

      {/* Enlaces principales */}
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/home" className="hover:text-pink-200 transition">
          Inicio
        </Link>
        <Link to="/acerca" className="hover:text-pink-200 transition">
          Acerca de Nosotros
        </Link>
        <Link to="/reseñas" className="hover:text-pink-200 transition">
          Reseñas
        </Link>
        <Link to="/contacto" className="hover:text-pink-200 transition">
          Contacto
        </Link>
        <Link to="/catalogo" className="hover:text-pink-200 transition">
          Catálogo
        </Link>

        {/* Solo visible si el usuario es admin */}
        {usuario.rol === "admin" && (
          <Link to="/mensajes" className="hover:text-pink-200 transition">
            Mensajes
          </Link>
        )}
      </div>

      {/* Usuario / Sesión */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <span className="text-sm font-medium">
              {usuario.nombre || "Usuario"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-lg text-white text-sm transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm hover:bg-pink-100 transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-3 py-1 rounded-lg text-sm transition"
            >
              Registro
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
