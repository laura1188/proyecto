// src/pages/PanelPedidos.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  User,
  MapPin,
  Calendar,
  ClipboardList,
  Clock,
} from "lucide-react";
import {
  obtenerPedidos,
  cambiarEstadoPedido,
} from "../services/pedidosServices.js";
import "../styles/pedidos.css";

export default function PanelPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerPedidos();
      setPedidos(data);
    } catch (e) {
      console.error("Error cargando pedidos:", e);
      setError("Error al cargar pedidos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
    setUpdatingId(pedidoId);
    try {
      await cambiarEstadoPedido(pedidoId, { estado: nuevoEstado });
      // actualizar localmente para respuesta instantánea
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (e) {
      console.error("Error cambiando estado:", e);
      alert("No se pudo cambiar el estado.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="panel-pedidos cargando">
        <Clock className="icono-large" /> Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return <div className="panel-pedidos error">{error}</div>;
  }

  if (!pedidos.length) {
    return <div className="panel-pedidos vacio">No hay pedidos disponibles.</div>;
  }

  return (
    <div className="panel-pedidos container">
      <div className="cabecera">
        <h2>
          <ClipboardList className="cabecera-icon" /> Panel de Pedidos
        </h2>
        <button className="btn-refresh" onClick={cargarPedidos}>
          Actualizar
        </button>
      </div>

      <div className="grid-pedidos">
        {pedidos.map((pedido) => (
          <motion.article
            className="pedido-card"
            key={pedido.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.22 }}
          >
            <header className="pedido-header">
              <h3>
                <Package className="inline-icon" /> Pedido #{pedido.id}
              </h3>
              <span className={`badge estado ${pedido.estado}`}>
                {pedido.estado}
              </span>
            </header>

            <div className="pedido-meta">
              <p>
                <User className="inline-icon" />{" "}
                <strong>Cliente:</strong> {pedido.cliente || "Desconocido"}
              </p>

              <p>
                <MapPin className="inline-icon" />{" "}
                <strong>Dirección:</strong>{" "}
                {pedido.direccion_entrega || "Sin dirección"}
              </p>

              <p>
                <Calendar className="inline-icon" />{" "}
                <strong>Creado:</strong>{" "}
                {new Date(pedido.fecha_creacion).toLocaleString()}
              </p>

              {pedido.fecha_entrega && (
                <p>
                  <Calendar className="inline-icon" />{" "}
                  <strong>Entrega:</strong>{" "}
                  {new Date(pedido.fecha_entrega).toLocaleString()}
                </p>
              )}
            </div>

            <div className="pedido-observaciones">
              <strong>Observaciones:</strong>{" "}
              {pedido.observaciones || "Ninguna"}
            </div>

            <div className="pedido-detalles">
              <strong>Detalles:</strong>
              <ul>
                {pedido.detalles.map((d) => (
                  <li key={d.id}>
                    {d.medicamento?.nombre || "Producto desconocido"} —{" "}
                    <span className="cantidad">x{d.cantidad}</span>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="pedido-actions">
              <div className="acciones-left">
                <button
                  className="btn-ghost"
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(pedido))}
                  title="Copiar JSON"
                >
                  Copiar
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => window.alert(`Detalles del pedido #${pedido.id}`)}
                >
                  Ver
                </button>
              </div>

              <div className="acciones-right">
                {/* botones de transición de estado - se muestran condicionalmente */}
                {pedido.estado !== "completado" && (
                  <button
                    className="btn-primary"
                    disabled={updatingId === pedido.id}
                    onClick={() =>
                      handleCambiarEstado(pedido.id, pedido.estado === "pendiente" ? "en_proceso" : "completado")
                    }
                  >
                    {updatingId === pedido.id ? "..." : "Siguiente estado"}
                  </button>
                )}
              </div>
            </footer>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
