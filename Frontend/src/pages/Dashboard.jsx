import { useNavigate } from "react-router-dom";
import "../styles/app.css";
import tecnologia from "../assets/tecnologia.png";
import vehiculos from "../assets/vehiculos.png";
import edificios from "../assets/edificios.png";
// --- Iconos SVG Profesionales ---
const IconHome = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

const IconBox = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);

const IconTrendDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
        <polyline points="17 18 23 18 23 12"/>
    </svg>
);

const IconChart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
);

const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const IconLaptop = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
    </svg>
);

const IconCar = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
        <path d="M3 17V11l2-5h14l2 5v6"/>
        <path d="M5 11h14"/>
    </svg>
);

const IconBuilding = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="9" y1="6" x2="9" y2="6.01"/>
        <line x1="15" y1="6" x2="15" y2="6.01"/>
        <line x1="9" y1="10" x2="9" y2="10.01"/>
        <line x1="15" y1="10" x2="15" y2="10.01"/>
        <line x1="9" y1="14" x2="9" y2="14.01"/>
        <line x1="15" y1="14" x2="15" y2="14.01"/>
        <path d="M10 22v-4h4v4"/>
    </svg>
);

const IconPlay = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
);

function Dashboard() {
    const navegar = useNavigate();

    const categorias = [
        {
            id: "tecnologia",
            numero: "01",
            Icono: IconLaptop,
            titulo: "Tecnología",
            descripcion: "Equipos de cómputo, servidores y dispositivos electrónicos que impulsan la operación diaria.",
            articulos: ["Laptops", "Computadoras", "Servidores", "Impresoras", "Tablets"],
            imagen: tecnologia,
        },
        {
            id: "vehiculos",
            numero: "02",
            Icono: IconCar,
            titulo: "Vehículos",
            descripcion: "Flota de transporte que asegura la movilidad del personal y las operaciones logísticas.",
            articulos: ["Camionetas", "Autos", "Motocicletas", "Camiones"],
            imagen: vehiculos,
        },
        {
            id: "edificios",
            numero: "03",
            Icono: IconBuilding,
            titulo: "Edificios",
            descripcion: "Inmuebles, oficinas y bodegas que conforman el patrimonio físico de la organización.",
            articulos: ["Oficinas", "Bodegas", "Locales", "Terrenos"],
            imagen: edificios,
        },
    ];

    return (
        <div className="dashboard">

            {/* --- Sidebar --- */}
            <aside className="sidebar">
                <div className="logo">
                    <span className="logo-azul">DEPRE</span>CIACIÓN
                </div>

                <div className="menu">
                    <button className="activo">
                        <IconHome /> Inicio
                    </button>
                    <button>
                        <IconBox /> Activos
                    </button>
                    <button>
                        <IconTrendDown /> Depreciación
                    </button>
                    <button>
                        <IconChart /> Reportes
                    </button>
                    <button className="cerrar">
                        <IconLogout /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* --- Contenido Principal --- */}
            <main className="contenido">

                {/* Header */}
                <div className="encabezado">
                    <div>
                        <h1>Gestión de <span className="texto-azul">Activos</span></h1>
                        <p className="subtitulo">Selecciona una categoría para gestionar sus artículos</p>
                    </div>

                    <div className="usuario">
                        <div className="avatar">AD</div>
                        <span>Administrador</span>
                    </div>
                </div>

                {/* Título de sección */}
                <div className="seccion-titulo">
                    <h2>Seleccionar categoría</h2>
                    <div className="linea-azul"></div>
                </div>

                {/* Tarjetas de Categorías */}
                <div className="tarjetas">
                    {categorias.map((cat) => {
                        const IconoComponente = cat.Icono;
                        return (
                            <div className="tarjeta" key={cat.id}>
                                
                                {/* Imagen */}
                                <div className="tarjeta-imagen">
                                    <img src={cat.imagen} alt={cat.titulo} />
                                    <div className="tarjeta-overlay"></div>
                                    <div className="tarjeta-numero">{cat.numero}</div>
                                </div>

                                {/* Contenido */}
                                <div className="tarjeta-contenido">
                                    <div className="tarjeta-header">
                                        <span className="tarjeta-icono">
                                            <IconoComponente />
                                        </span>
                                        <h3>{cat.titulo}</h3>
                                    </div>
                                    
                                    <p className="tarjeta-descripcion">{cat.descripcion}</p>

                                    <div className="tarjeta-articulos">
                                        <span className="etiqueta">Artículos que entran aquí:</span>
                                        <div className="tags">
                                            {cat.articulos.map((art, i) => (
                                                <span key={i} className="tag">{art}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="btn-seleccionar" onClick={() => navegar(`/${cat.id}`)}>
                                        <IconPlay /> Seleccionar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;