import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoOpen, setCarritoOpen] = useState(false);

  // ============================
  // 🔐 Obtener TOKEN si existe
  // ============================
  const token = localStorage.getItem("token");

  const API_PEDIDOS = "http://127.0.0.1:8000/api/pedidos/crud/";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/inventario/catalogo/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar medicamentos:", err));
  }, []);

  // ============================
  // ➕ Agregar medicamento al carrito
  // ============================
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);

    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // ============================
  // ➖ Reducir cantidad
  // ============================
  const reducirCantidad = (id) => {
    setCarrito(
      carrito
        .map((p) =>
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  // ============================
  // 🗑 Eliminar producto
  // ============================
  const eliminar = (id) =>
    setCarrito(carrito.filter((p) => p.id !== id));

  // ============================
  // 📨 ENVIAR PEDIDO (con token)
  // ============================
  const enviarPedido = async () => {
    if (!carrito.length) return alert("El carrito está vacío");

    const detalles = carrito.map((p) => ({
      medicamento: p.id,
      cantidad: p.cantidad,
      subtotal: p.precio_venta * p.cantidad,
    }));

    const total = detalles.reduce((t, d) => t + d.subtotal, 0);

    try {
      const res = await axios.post(
        API_PEDIDOS,
        {
          cliente: 1, // <-- luego cambiar por usuario logueado
          total,
          detalles,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      alert("Pedido enviado correctamente");
      setCarrito([]);
    } catch (e) {
      console.log("ERROR AL ENVIAR PEDIDO:", e);
      alert("Error enviando pedido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Sección bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-10 mt-6"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
          Bienvenido a tu tienda de confianza 💊
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto">
          Compra medicamentos de calidad con atención personalizada y entrega rápida.
        </p>
      </motion.div>

      {/* Catálogo */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {productos.length > 0 ? (
          productos.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition-all"
            >
              <img
                src={p.imagen_url || "/placeholder.png"}
                alt={p.nombre}
                className="w-full h-48 object-contain mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800">{p.nombre}</h3>
              <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
              <p className="mt-3 text-lg font-bold text-green-600">
                ${p.precio_venta?.toLocaleString("es-CO")}
              </p>

              <button
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                onClick={() => agregarAlCarrito(p)}
              >
                ➕ Agregar al pedido
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-lg col-span-3">Cargando medicamentos...</p>
        )}
      </motion.div>

      {/* Carrito lateral */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l transition-transform duration-300 p-4 ${
          carritoOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">🛒 Carrito</h3>

        {carrito.map((p) => (
          <div key={p.id} className="border-b pb-3 mb-3">
            <p className="font-semibold">{p.nombre}</p>
            <p className="text-sm text-gray-600">Cantidad: {p.cantidad}</p>

            <div className="flex gap-2 mt-2">
              <button className="bg-gray-300 px-2" onClick={() => reducirCantidad(p.id)}>
                -
              </button>
              <button className="bg-gray-300 px-2" onClick={() => agregarAlCarrito(p)}>
                +
              </button>
              <button
                className="bg-red-500 text-white px-2 rounded"
                onClick={() => eliminar(p.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}

        {carrito.length > 0 && (
          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={enviarPedido}
          >
            📦 Enviar pedido
          </button>
        )}
      </div>

      {/* Botón carrito */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setCarritoOpen(!carritoOpen)}
      >
        🛒
      </button>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-4 text-center mt-auto">
        © 2025 www.mims.co
      </footer>
    </div>
  );
}
