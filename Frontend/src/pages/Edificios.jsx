import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import {
    obtenerActivos,
    crearActivo,
    actualizarActivo,
    eliminarActivo
} from "../services/activosService";

import {
    calcularDepreciacion,
    generarHistorial,
    obtenerHistorial,
    generarReporte
} from "../services/depreciacionService";

// --- Iconos SVG ---
const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
    </svg>
);

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const IconAlert = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);

const IconCalculator = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="8" y2="10.01"/>
        <line x1="12" y1="10" x2="12" y2="10.01"/>
        <line x1="16" y1="10" x2="16" y2="10.01"/>
        <line x1="8" y1="14" x2="8" y2="14.01"/>
        <line x1="12" y1="14" x2="12" y2="14.01"/>
        <line x1="16" y1="14" x2="16" y2="14.01"/>
        <line x1="8" y1="18" x2="16" y2="18"/>
    </svg>
);

const IconFile = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
);

// Tipos de activos de Edificios (categoría 1)
const TIPOS_EDIFICIOS = {
    10: "Edificio",
    11: "Oficina",
    12: "Bodega",
};

function InfoItem({ label, value, highlight }) {
    return (
        <div>
            <div style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                color: "#64748b",
                fontWeight: 600,
                marginBottom: 4,
            }}>
                {label}
            </div>
            <div style={{
                color: highlight ? "#4ade80" : "#fff",
                fontSize: 14,
                fontWeight: highlight ? 700 : 500,
            }}>
                {value}
            </div>
        </div>
    );
}

export default function Edificios() {
    const navigate = useNavigate();

    const [activos, setActivos] = useState([]);
    const [formulario, setFormulario] = useState({
        descripcion: "",
        idTipo: "",
        fechaCompra: "",
        valorCompra: ""
    });

    const [activoSeleccionado, setActivoSeleccionado] = useState(null);
    const [fechaCalculo, setFechaCalculo] = useState("");
    const [depreciacion, setDepreciacion] = useState([]);
    const [datosDepreciacion, setDatosDepreciacion] = useState(null);

    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    useEffect(() => {
        cargarActivos();
    }, []);

    // ============ CARGAR ============
    const cargarActivos = async () => {
        try {
            const respuesta = await obtenerActivos();
            const filtrados = respuesta.data.filter((a) =>
                Object.keys(TIPOS_EDIFICIOS).includes(String(a.idTipo))
            );
            setActivos(filtrados);
        } catch (error) {
            console.error(error);
            mostrarMensaje("No se pudieron cargar los inmuebles", "error");
        }
    };

    const mostrarMensaje = (texto, tipo = "exito") => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => setMensaje(""), 4000);
    };

    const manejarCambio = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    // ============ CREAR / ACTUALIZAR ============
    const registrarActivo = async (e) => {
        e.preventDefault();

        try {
            const datos = {
                descripcion: formulario.descripcion,
                idTipo: Number(formulario.idTipo),
                fechaCompra: formulario.fechaCompra,
                valorCompra: Number(formulario.valorCompra)
            };

            if (editando) {
                await actualizarActivo(activoSeleccionado.idActivo, datos);
                mostrarMensaje("Inmueble actualizado correctamente", "exito");
            } else {
                await crearActivo(datos);
                mostrarMensaje("Inmueble registrado correctamente", "exito");
            }

            limpiarFormulario();
            cargarActivos();

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data?.mensaje || "No se pudo guardar el inmueble",
                "error"
            );
        }
    };

    // ============ EDITAR ============
    const editarActivo = (a) => {
        setFormulario({
            descripcion: a.descripcion,
            idTipo: a.idTipo,
            fechaCompra: a.fechaCompra.substring(0, 10),
            valorCompra: a.valorCompra
        });
        setActivoSeleccionado(a);
        setEditando(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ============ ELIMINAR ============
    const borrarActivo = async (id) => {
        if (!window.confirm("¿Desea eliminar este inmueble?")) return;

        try {
            await eliminarActivo(id);

            if (activoSeleccionado?.idActivo === id) {
                setActivoSeleccionado(null);
                setDepreciacion([]);
                setDatosDepreciacion(null);
            }

            mostrarMensaje("Inmueble eliminado correctamente", "exito");
            cargarActivos();

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data?.mensaje || "No se pudo eliminar el inmueble",
                "error"
            );
        }
    };

    // ============ VER → HISTORIAL AUTOMÁTICO ============
    const seleccionarActivo = async (activo) => {
        setActivoSeleccionado(activo);
        setFechaCalculo("");
        setDatosDepreciacion(null);
        setDepreciacion([]);

        try {
            await generarHistorial(activo.idActivo);

            const respuesta = await obtenerHistorial(activo.idActivo);

            setDepreciacion(respuesta.data);
        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data?.mensaje || "No se pudo cargar el historial",
                "error"
            );
        }

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    // ============ CALCULAR POR FECHA ============
    const calcular = async () => {
        if (!activoSeleccionado) {
            return mostrarMensaje("Seleccione un inmueble", "error");
        }
        if (!fechaCalculo) {
            return mostrarMensaje("Seleccione una fecha de cálculo", "error");
        }

        try {
            const respuesta = await calcularDepreciacion({
                idActivo: activoSeleccionado.idActivo,
                fechaCalculo: fechaCalculo
            });

            setDatosDepreciacion(respuesta.data);
            setMensaje("");
        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data?.mensaje ||
                    "No se pudo calcular la depreciación",
                "error"
            );
            setDatosDepreciacion(null);
        }
    };

    // ============ DESCARGAR REPORTE PDF ============
    const descargarReporte = async () => {
        if (!activoSeleccionado) {
            return mostrarMensaje("Seleccione un inmueble", "error");
        }

        try {
            const respuesta = await generarReporte(activoSeleccionado.idActivo);

            const archivo = new Blob(
                [respuesta.data],
                { type: "application/pdf" }
            );

            const url = window.URL.createObjectURL(archivo);

            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = `Reporte_Depreciacion_${activoSeleccionado.idActivo}.pdf`;

            document.body.appendChild(enlace);
            enlace.click();

            enlace.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data?.mensaje ||
                    "No se pudo generar el reporte",
                "error"
            );
        }
    };

    // ============ LIMPIAR ============
    const limpiarFormulario = () => {
        setFormulario({ descripcion: "", idTipo: "", fechaCompra: "", valorCompra: "" });
        setEditando(false);
        setActivoSeleccionado(null);
        setFechaCalculo("");
        setDepreciacion([]);
        setDatosDepreciacion(null);
    };

    // ============ UTILS ============
    const nombreTipo = (idTipo) => TIPOS_EDIFICIOS[idTipo] || "Desconocido";

    const formatoFecha = (fecha) => {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleDateString("es-EC");
    };

    const formatoMoneda = (valor) =>
        Number(valor).toLocaleString("es-EC", {
            style: "currency",
            currency: "USD"
        });

    // ============ RENDER ============
    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Edificios</h1>
                    <p className="subtitle">
                        Registra, edita y calcula la depreciación de inmuebles
                    </p>
                </div>
                <div className="actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/activos')}>
                        <IconArrowLeft /> Volver a Activos
                    </button>
                </div>
            </div>

            <div className="form-grid-dos">
                <div className="card">
                    <h2 className="card-title">
                        {editando ? "Editar inmueble" : "Registrar inmueble"}
                    </h2>
                    <p className="card-subtitle">
                        {editando ? "Modifica los datos del inmueble" : "Ingresa los datos del inmueble"}
                    </p>

                    <form onSubmit={registrarActivo}>
                        <div className="form-field">
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                placeholder="Ej. Oficina central"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Tipo de inmueble</label>
                            <select
                                name="idTipo"
                                value={formulario.idTipo}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar tipo</option>
                                {Object.entries(TIPOS_EDIFICIOS).map(([id, nombre]) => (
                                    <option key={id} value={id}>{nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Fecha de compra</label>
                                <input
                                    type="date"
                                    name="fechaCompra"
                                    value={formulario.fechaCompra}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Valor de compra</label>
                                <input
                                    type="number"
                                    name="valorCompra"
                                    value={formulario.valorCompra}
                                    onChange={manejarCambio}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        {mensaje && (
                            <div className={`alert ${tipoMensaje === "error" ? "alert-error" : "alert-success"}`}>
                                {tipoMensaje === "error" ? <IconAlert /> : <IconCheck />}
                                {mensaje}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                            <button className="btn btn-primary" type="submit">
                                <IconCheck />
                                {editando ? "Actualizar inmueble" : "Registrar inmueble"}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h2 className="card-title">Depreciación</h2>
                    <p className="card-subtitle">
                        Se calcula automáticamente con los datos del inmueble
                    </p>

                    <div className="info-row">
                        <span className="label">Vida útil</span>
                        <span className="value">20 años</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Valor residual</span>
                        <span className="value">10%</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Método</span>
                        <span className="value">Línea recta</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">
                    Inmuebles registrados ({activos.length})
                </h2>
                <p className="card-subtitle">Lista de inmuebles en el sistema</p>

                {activos.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay inmuebles registrados aún</p>
                        <span>Usa el formulario de arriba para agregar el primero</span>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descripción</th>
                                    <th>Tipo</th>
                                    <th>Fecha compra</th>
                                    <th>Valor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activos.map((a) => (
                                    <tr key={a.idActivo}>
                                        <td>#{a.idActivo}</td>
                                        <td style={{ color: "#fff", fontWeight: 500 }}>
                                            {a.descripcion}
                                        </td>
                                        <td>
                                            <span className="badge">
                                                {nombreTipo(a.idTipo)}
                                            </span>
                                        </td>
                                        <td>{formatoFecha(a.fechaCompra)}</td>
                                        <td style={{ color: "#4ade80", fontWeight: 700 }}>
                                            {formatoMoneda(a.valorCompra)}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => seleccionarActivo(a)}
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => editarActivo(a)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => borrarActivo(a.idActivo)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {activoSeleccionado && (
                <div className="card">
                    <h2 className="card-title">Depreciación del inmueble</h2>
                    <p className="card-subtitle">
                        Historial anual y consulta por fecha
                    </p>

                    <div className="form-grid" style={{ marginBottom: 20 }}>
                        <InfoItem label="Inmueble" value={activoSeleccionado.descripcion} />
                        <InfoItem label="Tipo" value={nombreTipo(activoSeleccionado.idTipo)} />
                        <InfoItem label="Fecha compra" value={formatoFecha(activoSeleccionado.fechaCompra)} />
                        <InfoItem label="Valor compra" value={formatoMoneda(activoSeleccionado.valorCompra)} highlight />
                    </div>

                    {/* HISTORIAL ANUAL */}
                    {depreciacion.length > 0 && (
                        <div style={{ marginTop: 28 }}>
                            <h3 style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#60a5fa",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                marginBottom: 16
                            }}>
                                Historial anual de depreciación
                            </h3>

                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Año</th>
                                            <th>Fecha corte</th>
                                            <th>Meses</th>
                                            <th>Valor inicial</th>
                                            <th>Dep. período</th>
                                            <th>Dep. acumulada</th>
                                            <th>Valor actual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {depreciacion.map((fila) => (
                                            <tr key={fila.anioDep}>
                                                <td style={{ color: "#60a5fa", fontWeight: 700 }}>
                                                    {fila.anioDep}
                                                </td>
                                                <td>{formatoFecha(fila.fechaCorte)}</td>
                                                <td>{fila.mesesDepreciados}</td>
                                                <td>{formatoMoneda(fila.valorInicial)}</td>
                                                <td style={{ color: "#60a5fa", fontWeight: 600 }}>
                                                    {formatoMoneda(fila.depreciacionPeriodo)}
                                                </td>
                                                <td>{formatoMoneda(fila.depreciacionAcumulada)}</td>
                                                <td style={{ color: "#4ade80", fontWeight: 700 }}>
                                                    {formatoMoneda(fila.valorActual)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 20
                            }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={descargarReporte}
                                >
                                    <IconFile /> Generar reporte PDF
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CONSULTA POR FECHA */}
                    <div style={{ marginTop: 32 }}>
                        <h3 style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#60a5fa",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginBottom: 16
                        }}>
                            Consultar depreciación por fecha
                        </h3>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Fecha de cálculo</label>
                                <input
                                    type="date"
                                    value={fechaCalculo}
                                    min={activoSeleccionado.fechaCompra.substring(0, 10)}
                                    onChange={(e) => setFechaCalculo(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "flex-end" }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={calcular}
                                >
                                    <IconCalculator />
                                    Calcular depreciación
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RESULTADO POR FECHA */}
                    {datosDepreciacion && (
                        <div style={{ marginTop: 24 }}>
                            <h3 style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#60a5fa",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                marginBottom: 16
                            }}>
                                Resultado para {formatoFecha(fechaCalculo)}
                            </h3>

                            <div className="form-grid">
                                <InfoItem
                                    label="Categoría"
                                    value={datosDepreciacion.nombreCategoria}
                                />
                                <InfoItem
                                    label="Vida útil"
                                    value={`${datosDepreciacion.vidaUtilAnios} años`}
                                />
                                <InfoItem
                                    label="Valor residual"
                                    value={`${datosDepreciacion.porcentajeValorResidual}%`}
                                />
                                <InfoItem
                                    label="Valor compra"
                                    value={formatoMoneda(datosDepreciacion.valorCompra)}
                                />
                                <InfoItem
                                    label="Depreciación acumulada"
                                    value={formatoMoneda(datosDepreciacion.depreciacionAcumulada)}
                                />
                                <InfoItem
                                    label="Valor actual"
                                    value={formatoMoneda(datosDepreciacion.valorActual)}
                                    highlight
                                />
                            </div>

                            {datosDepreciacion.llegoAlLimite && (
                                <div className="alert alert-info" style={{ marginTop: 16 }}>
                                    El activo alcanzó su valor residual del{" "}
                                    {datosDepreciacion.porcentajeValorResidual}%
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
}