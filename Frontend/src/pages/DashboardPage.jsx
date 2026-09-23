import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosClient from '../api/axiosClient';

export default function DashboardPage() {
    const [activos, setActivos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const datosUsuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const nombreCompleto = `${datosUsuario?.nombre || ''} ${datosUsuario?.apellido || ''}`.trim() || 'Usuario';

    useEffect(() => {
        axiosClient
            .get('/activos')
            .then((res) => setActivos(res.data))
            .catch((err) => console.error(err))
            .finally(() => setCargando(false));
    }, []);

    const totalActivos = activos.length;
    const totalValor = activos.reduce((s, a) => s + Number(a.valorCompra || 0), 0);

    // Contadores por categoría (real, según los activos que existan)
    const contarCategoria = (nombre) =>
        activos.filter((a) => (a.nombreCategoria || '').toLowerCase().includes(nombre)).length;

    const totalTecnologia = contarCategoria('tecnolog');
    const totalVehiculos = contarCategoria('veh');
    const totalEdificios = contarCategoria('edif');

    const formatoMoneda = (v) =>
        Number(v).toLocaleString('es-EC', { style: 'currency', currency: 'USD' });

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Bienvenido, <span>{nombreCompleto}</span></h1>
                    <p className="subtitle">Panel principal del sistema de depreciación</p>
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
        </Layout>
    );
}