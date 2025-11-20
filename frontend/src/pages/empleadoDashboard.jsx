import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MedicamentosEmpleado from "../pages/medicamentosEmpleado";
import PanelFactura from "../pages/panelFactura";
import PanelPedidos from "../pages/PanelPedidos";
import "../styles/empleadoDashboard.css";

// Iconos profesionales de lucide-react
import { Pill, FileText, Package } from "lucide-react";

export default function EmpleadoDashboard() {
  const [seccionActual, setSeccionActual] = useState("medicamentos");

  // Pasamos iconos al Sidebar
  const secciones = [
    { id: "medicamentos", nombre: "Medicamentos", icono: <Pill size={20} /> },
    { id: "facturas", nombre: "Facturas", icono: <FileText size={20} /> },
    { id: "pedidos", nombre: "Pedidos", icono: <Package size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar
        seccionActual={seccionActual}
        setSeccion={setSeccionActual}
        secciones={secciones} // enviamos las secciones con iconos
      />

      <div className="dashboard-content">
        {seccionActual === "medicamentos" && <MedicamentosEmpleado />}
        {seccionActual === "facturas" && <PanelFactura />}
        {seccionActual === "pedidos" && <PanelPedidos />}
      </div>
    </div>
  );
}
