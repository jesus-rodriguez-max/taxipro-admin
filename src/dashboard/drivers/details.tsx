import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';

interface DriverData {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: any;
  vehicleModel?: string;
  vehiclePlate?: string;
}

export default function DriverDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDriver();
  }, [id]);

  const loadDriver = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'drivers', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDriver(docSnap.data() as DriverData);
      }
    } catch (error) {
      console.error('Error loading driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id || !confirm(`¿Cambiar estado a "${newStatus}"?`)) return;
    setUpdating(true);
    try {
      const docRef = doc(db, 'drivers', id);
      await updateDoc(docRef, { status: newStatus });
      setDriver((prev) => prev ? { ...prev, status: newStatus } : null);
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">Chofer no encontrado</div>
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    const badges: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    const className = badges[status || ''] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${className}`}>
        {status || 'unknown'}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Detalles del Chofer</h1>
        <button
          onClick={() => navigate('/dashboard/drivers')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Volver
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <p className="mt-1 text-lg">{driver.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{driver.email || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <p className="mt-1 text-lg">{driver.phone || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <p className="mt-1">{getStatusBadge(driver.status)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información del Vehículo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Modelo</label>
            <p className="mt-1 text-lg">{driver.vehicleModel || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Placas</label>
            <p className="mt-1 text-lg">{driver.vehiclePlate || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones</h2>
        <div className="flex flex-wrap gap-3">
          {driver.status === 'pending' && (
            <>
              <button
                onClick={() => updateStatus('active')}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Aprobar
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                Rechazar
              </button>
            </>
          )}
          {driver.status === 'active' && (
            <button
              onClick={() => updateStatus('suspended')}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              Suspender
            </button>
          )}
          {driver.status === 'suspended' && (
            <button
              onClick={() => updateStatus('active')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Reactivar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
