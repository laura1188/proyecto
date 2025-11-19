// src/services/inventarioService.js
import API from "./api.js";

/* ===============================
   📦 CATALOGO PÚBLICO (sin token)
================================= */
export const getCatalogoPublico = async () => {
  const res = await API.get("/inventario/catalogo/");
  return res.data;
};

/* ===============================
   📚 CATEGORÍAS
================================= */
export const getCategorias = async () => {
  const res = await API.get("/inventario/categorias/");
  return res.data;
};

/* ===============================
   💊 MEDICAMENTOS (CRUD protegido)
================================= */
export const getMedicamentos = async () => {
  const res = await API.get("/inventario/medicamentos/");
  return res.data;
};

export const crearMedicamento = async (data) => {
  const res = await API.post("/inventario/medicamentos/", data);
  return res.data;
};

export const actualizarMedicamento = async (id, data) => {
  const res = await API.put(`/inventario/medicamentos/${id}/`, data);
  return res.data;
};

export const eliminarMedicamento = async (id) => {
  const res = await API.delete(`/inventario/medicamentos/${id}/`);
  return res.data;
};
