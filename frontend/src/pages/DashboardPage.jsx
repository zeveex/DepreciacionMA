import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [mensajeBackend, setMensajeBackend] = useState('Cargando...');

  useEffect(() => {
    axiosClient
      .get('/Login/protegido')
      .then((res) => setMensajeBackend(res.data))
      .catch(() => setMensajeBackend('No autorizado'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Bienvenido, {usuario}</h1>
      <p>
        Respuesta del backend protegido: <strong>{mensajeBackend}</strong>
      </p>

      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Cerrar sesion
      </button>
    </div>
  );
}