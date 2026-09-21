import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    nombreUsuario: '',
    password: '',
    confirmarPassword: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (form.password !== form.confirmarPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (form.nombreUsuario.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    setCargando(true);

    try {
      const response = await axiosClient.post('/Login/registrar', {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim().toLowerCase(),
        nombreUsuario: form.nombreUsuario.trim(),
        password: form.password,
      });

      setExito('Cuenta creada. Revisa tu correo para el codigo de verificacion...');

      setTimeout(() => {
        navigate('/verify', {
          state: {
            idUsuario: response.data.idUsuario,
            correo: form.correo.trim().toLowerCase(),
          },
        });
      }, 2000);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data ||
        'Error al registrar usuario';
      setError(typeof mensaje === 'string' ? mensaje : 'Error al registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear Cuenta</h1>
        <p style={styles.subtitle}>Registrate para comenzar</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                maxLength={100}
                style={styles.input}
                placeholder="Juan"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                maxLength={100}
                style={styles.input}
                placeholder="Perez"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              maxLength={150}
              style={styles.input}
              placeholder="juan@correo.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Nombre de Usuario</label>
            <input
              type="text"
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              required
              maxLength={50}
              minLength={3}
              style={styles.input}
              placeholder="juanperez"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contrasena</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={255}
              style={styles.input}
              placeholder="Minimo 6 caracteres"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirmar Contrasena</label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={255}
              style={styles.input}
              placeholder="Repite la contrasena"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {exito && <p style={styles.exito}>{exito}</p>}

          <button
            type="submit"
            disabled={cargando}
            style={{
              ...styles.button,
              opacity: cargando ? 0.6 : 1,
              cursor: cargando ? 'not-allowed' : 'pointer',
            }}
          >
            {cargando ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={styles.link}>
          Ya tienes cuenta?{' '}
          <Link to="/login" style={styles.linkA}>
            Inicia sesion
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
    maxWidth: '500px',
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
    marginBottom: '30px',
  },
  row: {
    display: 'flex',
    gap: '15px',
  },
  field: {
    marginBottom: '20px',
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#444',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
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