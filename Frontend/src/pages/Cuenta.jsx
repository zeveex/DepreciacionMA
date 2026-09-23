import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axiosClient from '../api/axiosClient';

export default function Cuenta() {
    const [mensajeBackend, setMensajeBackend] = useState('Verificando...');

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const nombreCompleto = `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.trim() || 'Usuario';

    useEffect(() => {
        axiosClient.get('/auth/protegido')
            .then((r) => setMensajeBackend(typeof r.data === 'string' ? r.data : 'Conectado'))
            .catch(() => setMensajeBackend('No autorizado'));
    }, []);

    return (
        <Layout>
            <div className="page-header">
                <div>
                    <h1>Cuenta</h1>
                    <p className="subtitle">Información de tu cuenta</p>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Datos del usuario</h2>
                <p className="card-subtitle">Información registrada en el sistema</p>

                <div className="info-row">
                    <span className="label">Nombre completo</span>
                    <span className="value">{nombreCompleto}</span>
                </div>
                <div className="info-row">
                    <span className="label">Usuario</span>
                    <span className="value">{usuario?.nombreUsuario || '-'}</span>
                </div>
                <div className="info-row">
                    <span className="label">Correo</span>
                    <span className="value">{usuario?.correo || '-'}</span>
                </div>
                <div className="info-row">
                    <span className="label">Estado del servidor</span>
                    <span className="value"><span className="badge badge-success">{mensajeBackend}</span></span>
                </div>
            </div>
        </Layout>
    );
}