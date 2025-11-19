import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/facturas.css";

export default function PanelFactura() {
  const [clientes, setClientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [factura, setFactura] = useState({
    cliente: "",
    metodo_pago: "efectivo",
    direccion_entrega: "",
    observaciones: "",
  });

  const [detalles, setDetalles] = useState([]);

  // ==========================================
  // 🔹 Cargar clientes + medicamentos
  // ==========================================
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // -------------------
      // 🔥 obtener clientes
      // -------------------
      const resUsuarios = await API.get("usuarios/");
      console.log("Usuarios API:", resUsuarios.data);

      const listaClientes = Array.isArray(resUsuarios.data)
        ? resUsuarios.data
        : [];

      setClientes(listaClientes);

      // -------------------------
      // 🔥 obtener medicamentos
      // -------------------------
      const resMeds = await API.get("inventario/medicamentos/");
      console.log("Medicamentos API:", resMeds.data);

      const listaMedicamentos = Array.isArray(resMeds.data)
        ? resMeds.data
        : [];

      setMedicamentos(listaMedicamentos);

    } catch (err) {
      console.error("Error cargando datos:", err);
      setMensaje("❌ Error cargando datos. Revisa el backend.");
    }
  };

  // ==========================================
  // ➕ Agregar un detalle
  // ==========================================
  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      { medicamento_id: "", cantidad: 1, precio_unitario: 0, subtotal: 0 },
    ]);
  };

  // ==========================================
  // 🔄 Actualizar detalle
  // ==========================================
  const actualizarDetalle = (i, campo, valor) => {
    const copia = [...detalles];

    if (campo === "cantidad") valor = parseInt(valor) || 1;

    copia[i][campo] = valor;

    if (campo === "medicamento_id") {
      const med = medicamentos.find((m) => m.id === parseInt(valor));
      copia[i].precio_unitario = med ? parseFloat(m.precio_venta) : 0;
    }

    copia[i].subtotal = copia[i].cantidad * copia[i].precio_unitario;
    setDetalles(copia);
  };

  // ==========================================
  // 🗑 Eliminar detalle
  // ==========================================
  const eliminarDetalle = (i) => {
    setDetalles(detalles.filter((_, x) => x !== i));
  };

  // ==========================================
  // 💾 Registrar factura
  // ==========================================
  const registrarFactura = async () => {
    if (!factura.cliente || detalles.length === 0) {
      setMensaje("⚠ Seleccione cliente y agregue productos");
      return;
    }

    const data = {
      ...factura,
      total: detalles.reduce((sum, d) => sum + d.subtotal, 0),
      detalles: detalles.map((d) => ({
        medicamento: d.medicamento_id, // 👈 backend requiere "medicamento"
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal,
      })),
    };

    try {
      await API.post("facturacion/registrar/", data);
      setMensaje("✔ Factura registrada correctamente");

      setFactura({
        cliente: "",
        metodo_pago: "efectivo",
        direccion_entrega: "",
        observaciones: "",
      });
      setDetalles([]);

    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al registrar factura");
    }
  };

  // ==========================================
  // 🖥 Render
  // ==========================================
  return (
    <div className="panel-factura">
      <h2>🧾 Registrar Factura</h2>

      <div className="form-factura">

        {/* CLIENTES */}
        <div>
          <label>Cliente</label>
          <select
            value={factura.cliente}
            onChange={(e) => setFactura({ ...factura, cliente: e.target.value })}
          >
            <option value="">Seleccione cliente</option>

            {Array.isArray(clientes) &&
              clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.username}
                </option>
              ))
            }
          </select>
        </div>

        {/* MÉTODO DE PAGO */}
        <div>
          <label>Método de Pago</label>
          <select
            value={factura.metodo_pago}
            onChange={(e) => setFactura({ ...factura, metodo_pago: e.target.value })}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {/* DIRECCIÓN */}
        <input
          type="text"
          placeholder="Dirección entrega"
          value={factura.direccion_entrega}
          onChange={(e) =>
            setFactura({ ...factura, direccion_entrega: e.target.value })
          }
        />

        {/* OBSERVACIONES */}
        <textarea
          placeholder="Observaciones"
          value={factura.observaciones}
          onChange={(e) =>
            setFactura({ ...factura, observaciones: e.target.value })
          }
        />
      </div>

      <h3>💊 Detalles</h3>

      {Array.isArray(detalles) &&
        detalles.map((d, i) => (
          <div key={i} className="detalle-item">
            <select
              value={d.medicamento_id}
              onChange={(e) =>
                actualizarDetalle(i, "medicamento_id", e.target.value)
              }
            >
              <option value="">Seleccione medicamento</option>

              {Array.isArray(medicamentos) &&
                medicamentos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))
              }
            </select>

            <input
              type="number"
              min="1"
              value={d.cantidad}
              onChange={(e) => actualizarDetalle(i, "cantidad", e.target.value)}
            />

            <span>💲 {d.precio_unitario.toFixed(2)}</span>
            <span>Subtotal: 💰 {d.subtotal.toFixed(2)}</span>

            <button onClick={() => eliminarDetalle(i)}>❌</button>
          </div>
        ))}

      <button className="btn-add" onClick={agregarDetalle}>
        ➕ Agregar medicamento
      </button>

      <h2>Total: 💵 {detalles.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}</h2>

      <button className="btn-registrar" onClick={registrarFactura}>
        💾 Registrar
      </button>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
