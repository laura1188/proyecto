import React, { useState, useEffect } from "react";
import { getMedicamentos, crearMedicamento, actualizarMedicamento, eliminarMedicamento } from "../services/inventarioServices";
import "../styles/empleadoDashboard.css";

const MedicamentosEmpleado = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_venta: "",
    stock_actual: "",
  });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    setLoading(true);
    try {
      const data = await getMedicamentos();
      setMedicamentos(data);
    } catch {
      console.error("Error al cargar medicamentos");
    }
    setLoading(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarMedicamento(editando, formData);
        setMensaje("Medicamento actualizado");
      } else {
        await crearMedicamento(formData);
        setMensaje("Medicamento creado");
      }
      setFormData({ nombre: "", descripcion: "", precio_venta: "", stock_actual: "" });
      setEditando(null);
      cargarMedicamentos();
    } catch {
      setMensaje("Error al guardar");
    }
  };

  const handleEditar = (med) => {
    setFormData({
      nombre: med.nombre,
      descripcion: med.descripcion || "",
      precio_venta: med.precio_venta,
      stock_actual: med.stock_actual,
    });
    setEditando(med.id);
    setMensaje("");
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar este medicamento?")) {
      try {
        await eliminarMedicamento(id);
        setMensaje("Medicamento eliminado correctamente");
        cargarMedicamentos();
      } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        setMensaje("Ocurrió un error al eliminar.");
      }
    }
  };

  return (
    <div className="panel-empleado">
      <h2>Gestión de Medicamentos</h2>

      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
        <input type="number" name="precio_venta" placeholder="Precio" value={formData.precio_venta} onChange={handleChange} required />
        <input type="number" name="stock_actual" placeholder="Stock" value={formData.stock_actual} onChange={handleChange} required />

        <button type="submit">{editando ? "Actualizar" : "Registrar"}</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <table className="tabla-medicamentos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {medicamentos.map((m) => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td>{m.descripcion}</td>
              <td>{m.precio_venta}</td>
              <td>{m.stock_actual}</td>
              <td>
                <button onClick={() => handleEditar(m)}>Editar</button>
                <button onClick={() => handleEliminar(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicamentosEmpleado;
