import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [activos, setActivos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const datosUsuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const nombreCompleto = `${datosUsuario?.nombre || ''} ${datosUsuario?.apellido || ''}`.trim() || usuario || 'Usuario';

    useEffect(() => {
        cargarActivos();
    }, []);

    const cargarActivos = async () => {
        try {
            const res = await axiosClient.get('/activos');
            setActivos(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const totalActivos = activos.length;
    const totalValor = activos.reduce((s, a) => s + Number(a.valorCompra || 0), 0);
    const totalTecnologia = activos.filter(a => (a.nombreCategoria || '').toLowerCase().includes('tecnolog')).length;
    const totalVehiculos = activos.filter(a => (a.nombreCategoria || '').toLowerCase().includes('veh')).length;
    const totalEdificios = activos.filter(a => (a.nombreCategoria || '').toLowerCase().includes('edif')).length;

    const formatoMoneda = (v) =>
        Number(v).toLocaleString('es-EC', { style: 'currency', currency: 'USD' });

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Bienvenido, <span>{nombreCompleto}</span></h1>
                    <p className="subtitle">
                        Sistema de gestión de activos
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Activos registrados</div>
                    <div className="stat-value">{cargando ? '—' : totalActivos}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Valor total</div>
                    <div className="stat-value primary">
                        {cargando ? '—' : formatoMoneda(totalValor)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tecnología</div>
                    <div className="stat-value">{cargando ? '—' : totalTecnologia}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Vehículos</div>
                    <div className="stat-value">{cargando ? '—' : totalVehiculos}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Edificios</div>
                    <div className="stat-value">{cargando ? '—' : totalEdificios}</div>
                </div>
            </div>

            {/* ✅ Solo queda el acceso a Activos */}
            <div className="card">
                <h2 className="card-title">Accesos rápidos</h2>
                <p className="card-subtitle">Gestiona tus activos</p>

                <div className="menu-grid">
                    <button className="menu-card" onClick={() => navigate('/activos')}>
                        <h3>Activos</h3>
                        <p>Registra, edita y administra los activos de la empresa.</p>
                        <span className="link">Ir a Activos →</span>
                    </button>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Activos recientes</h2>
                <p className="card-subtitle">Últimos activos registrados en el sistema</p>

                {cargando ? (
                    <p style={{ color: '#64748b' }}>Cargando...</p>
                ) : activos.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay activos registrados</p>
                        <span>Comienza registrando tu primer activo</span>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activos.slice(0, 5).map((a) => (
                                    <tr key={a.idActivo}>
                                        <td>#{a.idActivo}</td>
                                        <td style={{ fontWeight: 500, color: '#0f172a' }}>
                                            {a.descripcion}
                                        </td>
                                        <td>
                                            <span className="badge">{a.nombreCategoria}</span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#16a34a' }}>
                                            {formatoMoneda(a.valorCompra)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}