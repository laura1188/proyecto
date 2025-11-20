// src/pages/PanelAdmin.jsx
import React, { useState } from "react";
import {
  LogOut,
  Users,
  Package,
  FileText,
  Settings,
  BarChart2,
  Mail,
} from "lucide-react";

// páginas
import Usuarios from "./Usuarios";
import Roles from "./Roles";
import Medicamentos from "./Medicamentos";
import Facturas from "./Facturas";
import Reportes from "./Reportes";
import Mensajes from "./Mensajes";

export default function PanelAdmin() {
  const [seccion, setSeccion] = useState("usuarios");

  const renderMain = () => {
    switch (seccion) {
      case "usuarios":
        return <Usuarios />;
      case "roles":
        return <Roles />;
      case "inventario":
        return <Medicamentos />;
      case "facturas":
        return <Facturas />;
      case "reportes":
        return <Reportes />;
      case "mensajes":
        return <Mensajes />;
      default:
        return <Usuarios />;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-gradient-to-b from-sky-700 to-blue-700 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Droguería MIMS</h1>
          <p className="text-sm text-sky-100 mt-1">Panel administrativo</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setSeccion("usuarios")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "usuarios" ? "bg-white/10" : ""
            }`}
          >
            <Users size={18} /> usuarios
          </button>

          <button
            onClick={() => setSeccion("roles")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "roles" ? "bg-white/10" : ""
            }`}
          >
            <Settings size={18} /> Roles
          </button>

          <button
            onClick={() => setSeccion("inventario")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "inventario" ? "bg-white/10" : ""
            }`}
          >
            <Package size={18} /> Inventario
          </button>

          <button
            onClick={() => setSeccion("facturas")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "facturas" ? "bg-white/10" : ""
            }`}
          >
            <FileText size={18} /> Facturas
          </button>

          <button
            onClick={() => setSeccion("reportes")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "reportes" ? "bg-white/10" : ""
            }`}
          >
            <BarChart2 size={18} /> Reportes
          </button>

          <button
            onClick={() => setSeccion("mensajes")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 ${
              seccion === "mensajes" ? "bg-white/10" : ""
            }`}
          >
            <Mail size={18} /> Mensajes
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{renderMain()}</main>
    </div>
  );
}
