import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/empleadoDashboard.css";

export default function PanelFactura() {
  const [clientes, setClientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [factura, setFactura] = useState({
    id: null,
    cliente: "",
    metodo_pago: "",
    direccion_entrega: "",
    observaciones: "",
    total: 0,
    detalles: [],
  });

  // ============================
  // 🔹 Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarClientes();
    cargarMedicamentos();
    cargarFacturas();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await API.get("/usuarios/usuarios/");
      setClientes(res.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const cargarMedicamentos = async () => {
    try {
      const res = await API.get("/inventario/medicamentos/");
      setMedicamentos(res.data);
    } catch (err) {
      console.error("Error al cargar medicamentos:", err);
    }
  };

  const cargarFacturas = async () => {
    try {
      const res = await API.get("/facturas/facturas/");
      setFacturas(res.data);
    } catch (err) {
      console.error("Error al cargar facturas:", err);
    }
  };

  // ============================
  // 🔹 Agregar detalle
  // ============================
  const agregarDetalle = () => {
    setFactura((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        {
          medicamento_id: "",
          medicamento_nombre: "",
          precio_unitario: 0,
          cantidad: 1,
          subtotal: 0,
        },
      ],
    }));
  };

  // ============================
  // 🔹 Actualizar detalle
  // ============================
  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...factura.detalles];

    if (campo === "medicamento_id") {
      const med = medicamentos.find((m) => m.id === parseInt(valor));
      nuevosDetalles[index].medicamento_id = parseInt(valor);
      nuevosDetalles[index].medicamento_nombre = med?.nombre || "";
      nuevosDetalles[index].precio_unitario = parseFloat(med?.precio_venta || 0);
    } else {
      nuevosDetalles[index][campo] = valor;
    }

    nuevosDetalles[index].subtotal =
      nuevosDetalles[index].cantidad * nuevosDetalles[index].precio_unitario;

    setFactura({
      ...factura,
      detalles: nuevosDetalles,
      total: calcularTotal(nuevosDetalles),
    });
  };

  const calcularTotal = (detalles) => {
    return detalles.reduce((acc, det) => acc + det.subtotal, 0);
  };

  // ============================
  // 🔹 Guardar factura
  // ============================
  const guardarFactura = async () => {
    try {
      const payload = {
        cliente: factura.cliente,
        metodo_pago: factura.metodo_pago,
        direccion_entrega: factura.direccion_entrega,
        observaciones: factura.observaciones,
        total: factura.total,
        detalles: factura.detalles.map((d) => ({
          medicamento_id: d.medicamento_id,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal,
        })),
      };

      if (factura.id) {
        await API.put(`/facturas/facturas/${factura.id}/`, payload);
        setMensaje("Factura actualizada correctamente.");
      } else {
        await API.post("/facturas/facturas/", payload);
        setMensaje("Factura registrada correctamente.");
      }

      limpiarFormulario();
      cargarFacturas();
    } catch (err) {
      console.error("Error al guardar factura:", err);
      setMensaje("Error al guardar factura.");
    }
  };

  // ============================
  // 🔹 Editar factura
  // ============================
  const editarFactura = (facturaSel) => {
    setFactura({
      id: facturaSel.id,
      cliente: facturaSel.cliente,
      metodo_pago: facturaSel.metodo_pago,
      direccion_entrega: facturaSel.direccion_entrega,
      observaciones: facturaSel.observaciones,
      total: parseFloat(facturaSel.total),
      detalles: facturaSel.detalles.map((d) => ({
        medicamento_id: null,
        medicamento_nombre: d.medicamento,
        precio_unitario: parseFloat(d.precio_unitario),
        cantidad: d.cantidad,
        subtotal: parseFloat(d.subtotal),
      })),
    });
  };

  // ============================
  // 🔹 Limpiar formulario
  // ============================
  const limpiarFormulario = () => {
    setFactura({
      id: null,
      cliente: "",
      metodo_pago: "efectivo",
      direccion_entrega: "",
      observaciones: "",
      total: 0,
      detalles: [],
    });
  };

  // ============================
  // 🔹 Formatear fecha
  // ============================
  const formatearFecha = (iso) => {
    return new Date(iso).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="panel-factura">
      <h2>Gestión de Facturas</h2>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      {/* =============================
          FORMULARIO FACTURA
      ============================= */}
      <select
        value={factura.cliente === null ? "" : factura.cliente}
        onChange={(e) => setFactura({ ...factura, cliente: e.target.value })}
      >
        <option value="" disabled hidden>
          Seleccione cliente
        </option>

        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre_completo}
          </option>
        ))}
      </select>

      <select
        value={factura.metodo_pago}
        onChange={(e) =>
          setFactura({ ...factura, metodo_pago: e.target.value })
        }
      >
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
        <option value="tarjeta">Tarjeta</option>
      </select>

      <input
        type="text"
        placeholder="Dirección de entrega"
        value={factura.direccion_entrega}
        onChange={(e) =>
          setFactura({ ...factura, direccion_entrega: e.target.value })
        }
      />

      <textarea
        placeholder="Observaciones"
        value={factura.observaciones}
        onChange={(e) =>
          setFactura({ ...factura, observaciones: e.target.value })
        }
      ></textarea>

      {/* =============================
          DETALLES
      ============================= */}
      <h3>Detalles</h3>

      {factura.detalles.map((det, index) => (
        <div key={index} className="detalle-item">
          <select
            value={det.medicamento_id || ""}
            onChange={(e) =>
              actualizarDetalle(index, "medicamento_id", e.target.value)
            }
          >
            <option value="">Seleccione medicamento</option>
            {medicamentos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={det.cantidad}
            onChange={(e) =>
              actualizarDetalle(index, "cantidad", parseInt(e.target.value))
            }
          />

          <input type="text" value={det.precio_unitario} readOnly />

          <input type="text" value={det.subtotal} readOnly />
        </div>
      ))}

      <button className="btn-add" onClick={agregarDetalle}>
        + Agregar detalle
      </button>

      <h3>Total: ${factura.total}</h3>

      <button className="btn-primary" onClick={guardarFactura}>
        {factura.id ? "Actualizar Factura" : "Registrar Factura"}
      </button>

      {/* =============================
          LISTADO DE FACTURAS
      ============================= */}
      <div className="facturas-list">
        {facturas.map((f) => (
          <div key={f.id} className="factura-item-card">
            <div className="factura-header">
              <span>Factura #{f.id}</span>
              <span>{formatearFecha(f.fecha_emision)}</span>
            </div>

            <div>
              <strong>Cliente:</strong> {f.cliente_nombre}
            </div>
            <div>
              <strong>Método:</strong> {f.metodo_pago}
            </div>

            <div className="factura-detalles">
              <table>
                <thead>
                  <tr>
                    <th>Medicamento</th>
                    <th>Cant</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {f.detalles.map((d) => (
                    <tr key={d.id}>
                      <td>{d.medicamento}</td>
                      <td>{d.cantidad}</td>
                      <td>${d.precio_unitario}</td>
                      <td>${d.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="factura-footer">
              <span>Total:</span> <strong>${f.total}</strong>
            </div>

            <button className="btn-primary" onClick={() => editarFactura(f)}>
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
