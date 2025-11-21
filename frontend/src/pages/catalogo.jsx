// src/pages/Catalogo.jsx
import React, { useEffect, useState } from "react";
import { getCategoriasConMedicamentos } from "../services/inventarioServices.js";
import "../styles/catalogo.css";

const Catalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const catConMed = await getCategoriasConMedicamentos();
        setCategorias(catConMed);
        if (catConMed.length > 0) setCategoriaActiva(catConMed[0].id); // Primera categoría activa por defecto
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos del catálogo");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando catálogo...</p>;
  if (error) return <p className="error">{error}</p>;

  const manejarClickCategoria = (id) => {
    setCategoriaActiva(id);
  };

  // Filtra la categoría seleccionada
  const categoriaSeleccionada = categorias.find(cat => cat.id === categoriaActiva);

  return (
    <div className="catalogo-container">

      {/* Botones de categorías */}
      <div className="categorias-botones">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`categoria-boton ${cat.id === categoriaActiva ? "activa" : ""}`}
            onClick={() => manejarClickCategoria(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Medicamentos de la categoría seleccionada */}
      {categoriaSeleccionada ? (
        <section className="categoria-seccion">
          <h2>{categoriaSeleccionada.nombre}</h2>

          {/* Bloque de descripción con estilo */}
          <div className="descripcion-categoria">
            {categoriaSeleccionada.descripcion || "Sin descripción"}
          </div>

          <div className="medicamentos-grid">
            {categoriaSeleccionada.medicamentos && categoriaSeleccionada.medicamentos.length > 0 ? (
              categoriaSeleccionada.medicamentos.map((med) => (
                <div key={med.id} className="medicamento-card">
                  {med.imagen_url ? (
                    <img src={med.imagen_url} alt={med.nombre} />
                  ) : (
                    <img src="/default-image.png" alt="Sin imagen" />
                  )}
                  <h3>{med.nombre}</h3>
                  <p>{med.descripcion ? med.descripcion.substring(0, 100) + "..." : "Sin descripción"}</p>
                  <p className="precio">Precio: ${med.precio_venta}</p>
                </div>
              ))
            ) : (
              <p>No hay medicamentos en esta categoría.</p>
            )}
          </div>
        </section>
      ) : (
        <p>No hay categorías disponibles.</p>
      )}

    </div>
  );
};

export default Catalogo;
