import { useEffect, useState } from "react";
import axios from "axios";

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const API_MENSAJES = "http://127.0.0.1:8000/api/mensajes/mensajes/";
  const API_RESENAS = "http://127.0.0.1:8000/api/mensajes/resenas/";

  // 📥 Cargar mensajes desde el backend
  const obtenerMensajes = async () => {
    try {
      const res = await axios.get(API_MENSAJES);
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      alert("❌ Error al cargar los mensajes desde el servidor");
    } finally {
      setCargando(false);
    }
  };

  // ✅ Marcar mensaje como leído
  const marcarComoLeido = async (id) => {
    try {
      await axios.patch(`${API_MENSAJES}${id}/`, { leido: true });
      setMensajes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      alert("❌ No se pudo marcar como leído");
    }
  };

  // 🌟 Publicar un mensaje como reseña
  const publicarComoResena = async (msg) => {
    try {
      const nuevaResena = {
        nombre: msg.nombre,
        comentario: msg.mensaje, // 👈 Campo correcto según el modelo Django (Resena.comentario)
        calificacion: 5, // Puedes hacerlo dinámico si lo deseas
      };

      console.log("📤 Enviando reseña:", nuevaResena);
      await axios.post(API_RESENAS, nuevaResena);

      alert("✅ Reseña publicada correctamente");
    } catch (error) {
      console.error("Error al publicar reseña:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
      alert("❌ Error al publicar la reseña. Revisa la consola para más detalles.");
    }
  };

  useEffect(() => {
    obtenerMensajes();
  }, []);

  // 💬 Renderizado
  if (cargando) return <p className="text-center mt-8">Cargando mensajes...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📩 Mensajes de Clientes
      </h1>

      {mensajes.length === 0 ? (
        <p className="text-gray-500 text-center">No hay mensajes aún.</p>
      ) : (
        <div className="space-y-4">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl shadow-md transition-all duration-300 ${
                msg.leido
                  ? "bg-gray-100 border border-gray-200"
                  : "bg-blue-50 border border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {msg.nombre}{" "}
                  <span className="text-gray-500 text-sm">
                    ({msg.correo})
                  </span>
                </h2>
                <small className="text-gray-500">
                  {new Date(msg.fecha_envio).toLocaleString()}
                </small>
              </div>

              <p className="text-gray-700">
                <strong>Asunto:</strong> {msg.asunto}
              </p>
              <p className="mt-2 text-gray-800">{msg.mensaje}</p>

              <div className="mt-3 flex gap-3">
                {!msg.leido && (
                  <button
                    onClick={() => marcarComoLeido(msg.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Marcar como leído
                  </button>
                )}

                <button
                  onClick={() => publicarComoResena(msg)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Publicar como reseña
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
