import React from "react";
import "../styles/sidebar.css";
import { Pill, FileText, Package } from "lucide-react";

const Sidebar = ({ seccionActual, setSeccion }) => {
  const items = [
    { id: "medicamentos", nombre: "Medicamentos", icono: <Pill size={20} /> },
    { id: "facturas", nombre: "Facturas", icono: <FileText size={20} /> },
    { id: "pedidos", nombre: "Pedidos", icono: <Package size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        <span className="title-icon">👨‍⚕️</span> Panel Empleado
      </h2>

      <ul className="sidebar-menu">
        {items.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${seccionActual === item.id ? "active" : ""}`}
            onClick={() => setSeccion(item.id)}
          >
            {item.icono} {item.nombre}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
