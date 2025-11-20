// src/pages/Roles.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
  });

  const base = "/usuarios/roles/"; // Ruta del ViewSet en DRF

  useEffect(() => {
    fetchRoles();
  }, []);

  /** ----------------------------------------
   * 1. Obtener lista de roles
   -----------------------------------------*/
  const fetchRoles = async () => {
    try {
      const res = await api.get(base);
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar roles");
    }
  };

  /** ----------------------------------------
   * 2. Guardar (crear o editar)
   -----------------------------------------*/
  const save = async () => {
    try {
      if (editing) {
        // PATCH actualiza parcialmente
        await api.patch(`${base}${editing.id}/`, form);
      } else {
        await api.post(base, form);
      }

      setOpen(false);
      resetForm();
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Error al guardar rol");
    }
  };

  /** ----------------------------------------
   * 3. Inactivar rol (DELETE → perform_destroy)
   -----------------------------------------*/
  const remove = async (r) => {
    if (!confirm("¿Inactivar rol?")) return;
    try {
      await api.delete(`${base}${r.id}/`);
      fetchRoles();
    } catch (err) {
      console.error(err);
      alert("Error al inactivar rol");
    }
  };

  /** ----------------------------------------
   * 4. Preparar modal para editar
   -----------------------------------------*/
  const startEdit = (r) => {
    setEditing(r);
    setForm({
      nombre: r.nombre,
      descripcion: r.descripcion,
      activo: r.activo,
    });
    setOpen(true);
  };

  /** ----------------------------------------
   * 5. Limpiar formulario
   -----------------------------------------*/
  const resetForm = () => {
    setEditing(null);
    setForm({ nombre: "", descripcion: "", activo: true });
  };

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestión de Roles</h2>

        <button
          onClick={() => { resetForm(); setOpen(true); }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Nuevo rol
        </button>
      </header>

      {/* Tabla */}
      <div className="bg-white rounded-lg p-4 shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.activo ? "Sí" : "No"}</td>
                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => startEdit(r)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => remove(r)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Inactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? "Editar rol" : "Nuevo rol"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Guardar
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre"
            className="w-full px-3 py-2 border rounded"
          />

          <textarea
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
            placeholder="Descripción"
            className="w-full px-3 py-2 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) =>
                setForm({ ...form, activo: e.target.checked })
              }
            />
            Activo
          </label>
        </div>
      </Modal>
    </div>
  );
}
