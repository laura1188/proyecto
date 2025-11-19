import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MedicamentosEmpleado from "../pages/MedicamentosEmpleado";
import PanelFactura from "../pages/PanelFactura";
import PanelPedidos from "../pages/PanelPedidos";
import "../styles/empleadoDashboard.css";

export default function EmpleadoDashboard() {
  const [seccionActual, setSeccionActual] = useState("medicamentos");

  return (
    <div className="dashboard-container">
      <Sidebar seccionActual={seccionActual} setSeccion={setSeccionActual} />

      <div className="dashboard-content">
        {seccionActual === "medicamentos" && <MedicamentosEmpleado />}
        {seccionActual === "facturas" && <PanelFactura />}
        {seccionActual === "pedidos" && <PanelPedidos />}
      </div>
    </div>
  );
}
