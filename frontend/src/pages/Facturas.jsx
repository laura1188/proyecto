// src/pages/Facturas.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal";
import { exportarFacturaAPDF } from "../services/pdfServices.js";

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [open, setOpen] = useState(false);
  const [detalles, setDetalles] = useState([]);
  const [selected, setSelected] = useState(null);

  // ✅ Ruta correcta según tu backend
  const base = "/facturas/facturas/";

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const res = await api.get(base);
      setFacturas(res.data);
    } catch (err) {
      console.error("Error cargando facturas:", err);
      alert("Error cargando facturas");
    }
  };

  const showDetails = (factura) => {
    setSelected(factura);
    setDetalles(factura.detalles || []);
    setOpen(true);
  };

  // ✅ Descargar PDF con jsPDF
  const descargarPDF = (factura) => {
    exportarFacturaAPDF(factura, factura.detalles || []);
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Facturas</h2>

        <div className="flex gap-3">
          <button
            onClick={cargarFacturas}
            className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
          >
             Refrescar
          </button>

          <button
            onClick={() => {
              if (selected) {
                descargarPDF(selected);
              } else {
                alert("Seleccione una factura primero");
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
             Descargar PDF
          </button>
        </div>
      </header>

      <div className="bg-white rounded-lg p-4 shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2">ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((f) => (
              <tr key={f.id} className="border-t hover:bg-slate-50 cursor-pointer">
                <td className="py-2">{f.id}</td>
                <td>{f.cliente_nombre || f.cliente}</td>
                <td>{new Date(f.fecha_emision).toLocaleString()}</td>
                <td className="font-semibold">${f.total}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => showDetails(f)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => descargarPDF(f)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                     PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={`Factura #${selected?.id || ""}`}
        onClose={() => setOpen(false)}
      >
        <div>
          <h4 className="font-semibold mb-2">Detalles</h4>

          {detalles.length === 0 ? (
            <p>No hay detalles.</p>
          ) : (
            detalles.map((d) => (
              <div
                key={d.id}
                className="border p-2 rounded mb-2 bg-slate-50"
              >
                <p>
                  <strong>{d.medicamento}</strong>
                </p>
                <p>
                  {d.cantidad} x ${d.precio_unitario} —{" "}
                  <strong>Subtotal: ${d.subtotal}</strong>
                </p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
