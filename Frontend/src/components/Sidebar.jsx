import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconHome = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
);

const IconBox = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);

const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const IconLogout = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ✅ Sin "Depreciación"
    const items = [
        { path: '/dashboard', label: 'Inicio', Icon: IconHome },
        { path: '/activos', label: 'Activos', Icon: IconBox },
        { path: '/cuenta', label: 'Cuenta', Icon: IconUser },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                DEPRE<span>CIACIÓN</span>
            </div>

            <nav className="sidebar-menu">
                {items.map(({ path, label, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        <Icon />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <IconLogout />
                <span>Cerrar sesión</span>
            </button>
        </aside>
    );
}