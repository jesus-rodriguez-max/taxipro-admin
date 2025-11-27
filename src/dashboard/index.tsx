import { useEffect, useState } from 'react';
import { getDashboardMetrics, getPendingDocumentsDrivers } from '../utils/firestore-queries';
import type { PendingDriver } from '../utils/firestore-queries';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeDrivers: 0,
    activeTrips: 0,
    totalPassengers: 0,
    suspendedDrivers: 0,
    pendingDocuments: 0,
  });
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriver[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsData, pendingData] = await Promise.all([
        getDashboardMetrics(),
        getPendingDocumentsDrivers(),
      ]);
      setMetrics(metricsData);
      setPendingDrivers(pendingData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Cargando métricas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Choferes Activos</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{metrics.activeDrivers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Viajes Activos</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{metrics.activeTrips}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pasajeros Registrados</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">{metrics.totalPassengers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Choferes Suspendidos</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{metrics.suspendedDrivers}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Pendientes de Documentos ({metrics.pendingDocuments})
          </h3>
          {pendingDrivers.length > 0 && (
            <Link
              to="/dashboard/drivers"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todos →
            </Link>
          )}
        </div>

        {pendingDrivers.length === 0 ? (
          <p className="text-gray-500">Sin choferes pendientes</p>
        ) : (
          <div className="space-y-3">
            {pendingDrivers.slice(0, 5).map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {driver.createdAt.toLocaleDateString('es-MX')}
                  </p>
                  <Link
                    to={`/dashboard/drivers/${driver.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
