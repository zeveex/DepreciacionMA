import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function VerifyPage() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const idUsuario = location.state?.idUsuario;
  const correo = location.state?.correo;

  if (!idUsuario) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Error</h2>
          <p>No se encontro informacion de registro.</p>
          <Link to="/register">Volver al registro</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await axiosClient.post('/Login/verificar', {
        idUsuario,
        codigo: codigo.trim(),
      });

      setExito('Cuenta verificada. Redirigiendo al login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data ||
        'Error al verificar';
      setError(typeof mensaje === 'string' ? mensaje : 'Error al verificar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Verificar Correo</h1>
        <p style={styles.subtitle}>Hemos enviado un codigo de 6 digitos a:</p>
        <p style={styles.correo}>{correo}</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Codigo de verificacion</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              required
              maxLength={6}
              minLength={6}
              style={{
                ...styles.input,
                textAlign: 'center',
                letterSpacing: '8px',
                fontSize: '24px',
              }}
              placeholder="000000"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {exito && <p style={styles.exito}>{exito}</p>}

          <button
            type="submit"
            disabled={cargando || codigo.length !== 6}
            style={{
              ...styles.button,
              opacity: cargando || codigo.length !== 6 ? 0.6 : 1,
              cursor:
                cargando || codigo.length !== 6 ? 'not-allowed' : 'pointer',
            }}
          >
            {cargando ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <p style={styles.link}>
          No recibiste el codigo?{' '}
          <Link to="/register" style={styles.linkA}>
            Volver a registrarte
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '28px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '5px',
  },
  correo: {
    textAlign: 'center',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '30px',
    wordBreak: 'break-all',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#444',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
  },
  error: {
    color: '#d32f2f',
    background: '#ffebee',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  exito: {
    color: '#2e7d32',
    background: '#e8f5e9',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  linkA: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
  },
};