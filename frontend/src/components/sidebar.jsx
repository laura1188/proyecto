import React from "react";
import "../styles/sidebar.css";

const Sidebar = ({ seccionActual, setSeccion }) => {
  const items = [
    { id: "medicamentos", nombre: "💊 Medicamentos" },
    { id: "facturas", nombre: "🧾 Facturas" },
    { id: "pedidos", nombre: "📝 Pedidos" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Panel Empleado</h2>

      <ul className="sidebar-menu">
        {items.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${
              seccionActual === item.id ? "active" : ""
            }`}
            onClick={() => setSeccion(item.id)}
          >
            {item.nombre}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
