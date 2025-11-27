import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firestore';

interface SafetyAlert {
  id: string;
  tripId: string;
  type: string;
  createdAt: Date;
  resolved: boolean;
}

export default function SafetyAlerts() {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'safety_logs'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as SafetyAlert[];
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Alertas de Seguridad</h1>
        <button
          onClick={loadAlerts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Cargando alertas...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No hay alertas de seguridad</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{alert.type}</h3>
                  <p className="text-sm text-gray-500">Trip ID: {alert.tripId}</p>
                  <p className="text-sm text-gray-500">
                    {alert.createdAt.toLocaleString('es-MX')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.resolved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {alert.resolved ? 'Resuelta' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
