import { useEffect, useState } from "react";
import {
    obtenerVehiculos,
    crearVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
    calcularDepreciacion
} from "../services/vehiculosService";
import "../styles/app.css";

// --- Iconos SVG ---
const IconArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
    </svg>
);

const IconCar = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
        <path d="M3 17V11l2-5h14l2 5v6"/>
        <path d="M5 11h14"/>
    </svg>
);

const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const IconDollar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const IconTag = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);

const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);

const IconTrendDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
    </svg>
);

const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
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

const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

function Vehiculos() {

    const [vehiculos, setVehiculos] = useState([]);

    const [formulario, setFormulario] = useState({
        descripcion: "",
        idTipo: "",
        fechaCompra: "",
        valorCompra: ""
    });

    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
    const [fechaCalculo, setFechaCalculo] = useState("");
    const [depreciacion, setDepreciacion] = useState([]);
    const [datosDepreciacion, setDatosDepreciacion] = useState(null);

    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const respuesta = await obtenerVehiculos();
            setVehiculos(respuesta.data);
        } catch (error) {
            console.error(error);
            mostrarMensaje("No se pudieron cargar los vehículos", "error");
        }
    };

    const mostrarMensaje = (texto, tipo = "exito") => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => setMensaje(""), 4000);
    };

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const registrarVehiculo = async (e) => {
        e.preventDefault();

        try {
            const datos = {
                descripcion: formulario.descripcion,
                idTipo: Number(formulario.idTipo),
                fechaCompra: formulario.fechaCompra,
                valorCompra: Number(formulario.valorCompra)
            };

            if (editando) {
                await actualizarVehiculo(
                    vehiculoSeleccionado.idActivo,
                    datos
                );
                mostrarMensaje("Vehículo actualizado correctamente", "exito");
            } else {
                await crearVehiculo(datos);
                mostrarMensaje("Vehículo registrado correctamente", "exito");
            }

            limpiarFormulario();
            cargarVehiculos();

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data || "No se pudo guardar el vehículo",
                "error"
            );
        }
    };

    const seleccionarVehiculo = (vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setFechaCalculo("");
        setDepreciacion([]);
        setDatosDepreciacion(null);

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    const editarVehiculo = (vehiculo) => {
        setFormulario({
            descripcion: vehiculo.descripcion,
            idTipo: vehiculo.idTipo,
            fechaCompra: vehiculo.fechaCompra.substring(0, 10),
            valorCompra: vehiculo.valorCompra
        });

        setVehiculoSeleccionado(vehiculo);
        setEditando(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const borrarVehiculo = async (id) => {
        if (!window.confirm("¿Desea eliminar este vehículo?")) return;

        try {
            await eliminarVehiculo(id);

            if (vehiculoSeleccionado && vehiculoSeleccionado.idActivo === id) {
                setVehiculoSeleccionado(null);
                setDepreciacion([]);
                setDatosDepreciacion(null);
            }

            mostrarMensaje("Vehículo eliminado correctamente", "exito");
            cargarVehiculos();

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data || "No se pudo eliminar el vehículo",
                "error"
            );
        }
    };

    const calcular = async () => {
        if (!vehiculoSeleccionado) {
            mostrarMensaje("Seleccione un vehículo", "error");
            return;
        }

        if (!fechaCalculo) {
            mostrarMensaje("Seleccione una fecha de cálculo", "error");
            return;
        }

        try {
            const respuesta = await calcularDepreciacion({
                idActivo: vehiculoSeleccionado.idActivo,
                fechaCalculo: fechaCalculo
            });

            setDatosDepreciacion(respuesta.data);
            setDepreciacion(respuesta.data.depreciacion);
            setMensaje("");

        } catch (error) {
            console.error(error);
            mostrarMensaje(
                error.response?.data || "No se pudo calcular la depreciación",
                "error"
            );
            setDepreciacion([]);
            setDatosDepreciacion(null);
        }
    };

    const limpiarFormulario = () => {
        setFormulario({
            descripcion: "",
            idTipo: "",
            fechaCompra: "",
            valorCompra: ""
        });
        setEditando(false);
        setVehiculoSeleccionado(null);
        setFechaCalculo("");
        setDepreciacion([]);
        setDatosDepreciacion(null);
    };

    const nombreTipo = (idTipo) => {
        const tipos = {
            7: "Moto",
            8: "Camioneta",
            9: "Automóvil"
        };
        return tipos[idTipo] || "Desconocido";
    };

    const formatoFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-EC");
    };

    const formatoMoneda = (valor) => {
        return Number(valor).toLocaleString("es-EC", {
            style: "currency",
            currency: "USD"
        });
    };

    return (
        <div className="vehiculos-page">

            {/* --- Header --- */}
            <div className="vehiculos-header">
                <div>
                    <span className="pagina-etiqueta">ACTIVOS</span>
                    <h1>Vehículos</h1>
                    <div className="linea-azul"></div>
                    <p>Registra, edita y calcula la depreciación de los vehículos.</p>
                </div>

                <button
                    className="btn-volver"
                    onClick={() => window.history.back()}
                >
                    <IconArrowLeft /> Volver
                </button>
            </div>


            {/* --- Formulario + Info --- */}
            <div className="vehiculos-contenido">

                <div className="formulario-card">

                    <div className="card-titulo">
                        <div className="card-titulo-icono">
                            <IconCar />
                        </div>
                        <div>
                            <h2>{editando ? "Editar vehículo" : "Registrar vehículo"}</h2>
                            <p>{editando ? "Modifica los datos del activo" : "Ingresa los datos del activo"}</p>
                        </div>
                    </div>

                    <form onSubmit={registrarVehiculo}>

                        <div className="campo">
                            <label><IconTag /> Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={manejarCambio}
                                placeholder="Ej. Camioneta Toyota Hilux"
                                required
                            />
                        </div>

                        <div className="campo">
                            <label>Tipo de vehículo</label>
                            <select
                                name="idTipo"
                                value={formulario.idTipo}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">Seleccionar tipo</option>
                                <option value="7">Moto</option>
                                <option value="8">Camioneta</option>
                                <option value="9">Automóvil</option>
                            </select>
                        </div>

                        <div className="campos-dos">
                            <div className="campo">
                                <label><IconCalendar /> Fecha de compra</label>
                                <input
                                    type="date"
                                    name="fechaCompra"
                                    value={formulario.fechaCompra}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label><IconDollar /> Valor de compra</label>
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

                        <div className="botones-formulario">
                            <button className="btn-registrar" type="submit">
                                <IconCheck />
                                {editando ? "Actualizar vehículo" : "Registrar vehículo"}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                    </form>

                    {mensaje && (
                        <div className={`mensaje ${tipoMensaje}`}>
                            {tipoMensaje === "exito" ? <IconCheck /> : <IconAlert />}
                            {mensaje}
                        </div>
                    )}

                </div>


                <div className="informacion-card">
                    <div className="info-header">
                        <div className="info-icono">
                            <IconTrendDown />
                        </div>
                        <span className="info-etiqueta">DEPRECIACIÓN</span>
                    </div>

                    <h2>Vehículos</h2>
                    <p>
                        La depreciación se calculará automáticamente
                        utilizando los datos registrados del vehículo.
                    </p>

                    <div className="info-dato">
                        <span>Vida útil</span>
                        <strong>5 años</strong>
                    </div>
                    <div className="info-dato">
                        <span>Valor residual</span>
                        <strong>10%</strong>
                    </div>
                    <div className="info-dato">
                        <span>Método</span>
                        <strong>Línea recta</strong>
                    </div>
                </div>

            </div>


            {/* --- Lista de Vehículos --- */}
            <div className="lista-vehiculos">

                <div className="lista-header">
                    <div>
                        <span className="pagina-etiqueta">REGISTROS</span>
                        <h2>Vehículos registrados</h2>
                    </div>
                    <span className="contador">
                        {vehiculos.length} {vehiculos.length === 1 ? "registrado" : "registrados"}
                    </span>
                </div>

                <div className="tabla-contenedor">

                    {vehiculos.length === 0 ? (
                        <div className="tabla-vacia">
                            <IconCar size={48} />
                            <p>No hay vehículos registrados aún.</p>
                            <span>Usa el formulario de arriba para agregar el primero.</span>
                        </div>
                    ) : (
                        <table className="tabla-vehiculos">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descripción</th>
                                    <th>Tipo</th>
                                    <th>Fecha de compra</th>
                                    <th>Valor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.idActivo}>
                                        <td className="col-id">#{vehiculo.idActivo}</td>
                                        <td className="col-descripcion">{vehiculo.descripcion}</td>
                                        <td>
                                            <span className="badge-tipo">
                                                {nombreTipo(vehiculo.idTipo)}
                                            </span>
                                        </td>
                                        <td className="col-fecha">
                                            {formatoFecha(vehiculo.fechaCompra)}
                                        </td>
                                        <td className="col-valor">
                                            {formatoMoneda(vehiculo.valorCompra)}
                                        </td>
                                        <td className="acciones">
                                            <button
                                                className="btn-ver"
                                                onClick={() => seleccionarVehiculo(vehiculo)}
                                            >
                                                <IconEye /> Ver
                                            </button>
                                            <button
                                                className="btn-editar"
                                                onClick={() => editarVehiculo(vehiculo)}
                                            >
                                                <IconEdit /> Editar
                                            </button>
                                            <button
                                                className="btn-eliminar"
                                                onClick={() => borrarVehiculo(vehiculo.idActivo)}
                                            >
                                                <IconTrash /> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>
            </div>


            {/* --- Depreciación --- */}
            {vehiculoSeleccionado && (
                <div className="depreciacion-card">

                    <div className="card-titulo">
                        <div className="card-titulo-icono">
                            <IconTrendDown />
                        </div>
                        <div>
                            <h2>Depreciación del vehículo</h2>
                            <p>Cálculo del valor actual según el método de línea recta</p>
                        </div>
                    </div>

                    <div className="datos-vehiculo">
                        <div>
                            <strong>Vehículo</strong>
                            <span>{vehiculoSeleccionado.descripcion}</span>
                        </div>
                        <div>
                            <strong>Tipo</strong>
                            <span>{nombreTipo(vehiculoSeleccionado.idTipo)}</span>
                        </div>
                        <div>
                            <strong>Fecha de compra</strong>
                            <span>{formatoFecha(vehiculoSeleccionado.fechaCompra)}</span>
                        </div>
                        <div>
                            <strong>Valor de compra</strong>
                            <span>{formatoMoneda(vehiculoSeleccionado.valorCompra)}</span>
                        </div>
                    </div>

                    <div className="calculo">
                        <div className="campo">
                            <label><IconCalendar /> Fecha de cálculo</label>
                            <input
                                type="date"
                                value={fechaCalculo}
                                min={vehiculoSeleccionado.fechaCompra.substring(0, 10)}
                                onChange={(e) => setFechaCalculo(e.target.value)}
                            />
                        </div>

                        <button className="btn-registrar" onClick={calcular}>
                            <IconCalculator /> Calcular depreciación
                        </button>
                    </div>

                    {datosDepreciacion && (
                        <>
                            <div className="resumen-depreciacion">
                                <div>
                                    <strong>Categoría</strong>
                                    <span>{datosDepreciacion.categoria.nombreCategoria}</span>
                                </div>
                                <div>
                                    <strong>Vida útil</strong>
                                    <span>{datosDepreciacion.categoria.vidaUtilAnios} años</span>
                                </div>
                                <div>
                                    <strong>Valor residual</strong>
                                    <span>{datosDepreciacion.categoria.porcentajeValorResidual}%</span>
                                </div>
                            </div>

                            {depreciacion.length > 0 ? (
                                <>
                                    <div className="tabla-contenedor">
                                        <table className="tabla-vehiculos">
                                            <thead>
                                                <tr>
                                                    <th>Período</th>
                                                    <th>Fecha</th>
                                                    <th>Meses</th>
                                                    <th>Valor inicial</th>
                                                    <th>Dep. período</th>
                                                    <th>Dep. acumulada</th>
                                                    <th>Valor actual</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {depreciacion.map((fila) => (
                                                    <tr key={fila.periodo}>
                                                        <td className="col-id">{fila.periodo}</td>
                                                        <td className="col-fecha">{formatoFecha(fila.fecha)}</td>
                                                        <td>{fila.mesesDepreciados}</td>
                                                        <td>{formatoMoneda(fila.valorInicial)}</td>
                                                        <td>{formatoMoneda(fila.depreciacionPeriodo)}</td>
                                                        <td>{formatoMoneda(fila.depreciacionAcumulada)}</td>
                                                        <td className="col-valor">{formatoMoneda(fila.valorActual)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="reporte">
                                        <button
                                            className="btn-reporte"
                                            onClick={() => alert("El reporte PDF se conectará en el siguiente paso.")}
                                        >
                                            <IconFile /> Generar reporte PDF
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="sin-depreciacion">
                                    No existen períodos de depreciación para la fecha seleccionada.
                                </div>
                            )}
                        </>
                    )}

                </div>
            )}

        </div>
    );
}

export default Vehiculos;