import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario'));

  const login = async (usuarioInput, password) => {
    const response = await axiosClient.post('/Login', {
      usuario: usuarioInput,
      password: password,
    });

    const { token: nuevoToken, mensaje } = response.data;

    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', usuarioInput);

    setToken(nuevoToken);
    setUsuario(usuarioInput);

    return { token: nuevoToken, mensaje };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        logout,
        isAuth: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}