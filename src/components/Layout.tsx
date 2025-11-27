import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logoutAdmin, auth } from '../firebase/auth';
import { useState, useEffect } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    setAdminEmail(auth.currentUser?.email || '');
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">TaxiPro Admin</h1>
        </div>
        
        <nav className="mt-6">
          <Link to="/dashboard" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/dashboard/drivers" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Choferes
          </Link>
          <Link to="/dashboard/passengers" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Pasajeros
          </Link>
          <Link to="/dashboard/trips" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Viajes
          </Link>
          <Link to="/dashboard/safety" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Seguridad
          </Link>
          <Link to="/dashboard/settings" className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
            Configuración
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Panel de Administración</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{adminEmail}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
