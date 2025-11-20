import API from "./api.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔹 Obtener todos los pedidos
export const obtenerPedidos = async () => {
  const res = await API.get("pedidos/listar/", getAuthHeaders());
  return res.data;
};

// 🔹 Cambiar estado del pedido
export const cambiarEstadoPedido = async (id, nuevoEstado) => {
  const res = await API.put(
    `pedidos/actualizar/${id}/`, // <-- usar endpoint personalizado
    { estado: nuevoEstado },
    getAuthHeaders()
  );
  return res.data;
};
