import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Iconos SVG
const IconLaptop = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
    </svg>
);

const IconCar = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
        <path d="M3 17V11l2-5h14l2 5v6"/>
        <path d="M5 11h14"/>
    </svg>
);

const IconBuilding = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

export default function Activos() {
    const navigate = useNavigate();

    const categorias = [
        {
            id: 'tecnologia',
            numero: '01',
            Icono: IconLaptop,
            titulo: 'Tecnología',
            descripcion: 'Equipos de cómputo, servidores y dispositivos electrónicos.',
            articulos: ['Laptops', 'Computadoras', 'Servidores', 'Impresoras'],
        },
        {
            id: 'vehiculos',
            numero: '02',
            Icono: IconCar,
            titulo: 'Vehículos',
            descripcion: 'Flota de transporte y vehículos de la organización.',
            articulos: ['Camionetas', 'Autos', 'Motocicletas'],
        },
        {
            id: 'edificios',
            numero: '03',
            Icono: IconBuilding,
            titulo: 'Edificios',
            descripcion: 'Inmuebles, oficinas y bodegas de la empresa.',
            articulos: ['Oficinas', 'Bodegas', 'Locales'],
        },
    ];

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Activos</h1>
                    <p className="subtitle">Selecciona una categoría para gestionar sus artículos</p>
                </div>
            </div>

            <div className="section-title">
                <h2>Seleccionar categoría</h2>
                <div className="line"></div>
            </div>

            <div className="categories-grid">
                {categorias.map((cat) => {
                    const IconoComponente = cat.Icono;
                    return (
                        <div className="category-card" key={cat.id}>
                            <div className="category-body">
                                <div className="category-head">
                                    <div className="category-icon">
                                        <IconoComponente />
                                    </div>
                                    <h3>{cat.titulo}</h3>
                                    <span className="category-number">{cat.numero}</span>
                                </div>

                                <p className="category-desc">{cat.descripcion}</p>

                                <div className="category-tags">
                                    <span className="label">Artículos que entran aquí:</span>
                                    <div className="tags">
                                        {cat.articulos.map((art, i) => (
                                            <span key={i} className="tag">{art}</span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => navigate(`/activos/${cat.id}`)}
                                >
                                    Seleccionar categoría
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}