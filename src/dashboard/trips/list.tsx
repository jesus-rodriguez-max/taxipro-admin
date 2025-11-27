import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import StatusFilter from '../../components/StatusFilter';

interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  status: string;
  fare?: number;
  createdAt: Date;
  passengerName?: string;
  driverName?: string;
}

const ITEMS_PER_PAGE = 20;

export default function TripsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, allTrips, currentPage]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'all') params.status = statusFilter;
    setSearchParams(params);
  }, [searchTerm, statusFilter, setSearchParams]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'trips'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      
      const tripsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          passengerId: data.passengerId || 'N/A',
          driverId: data.driverId || '',
          status: data.status || 'unknown',
          fare: data.fare || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          passengerName: data.passengerName || 'Pasajero',
          driverName: data.driverName || 'Sin asignar',
        };
      });

      setAllTrips(tripsData);
      setTotalTrips(tripsData.length);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTrips];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.id.toLowerCase().includes(term) ||
          trip.passengerName?.toLowerCase().includes(term) ||
          trip.driverName?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    setTotalTrips(filtered.length);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setTrips(filtered.slice(startIndex, endIndex));
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const className = badges[status] || 'bg-gray-100 text-gray-800';
    const label = status === 'pending' ? 'Pendiente' :
                  status === 'assigned' ? 'Asignado' :
                  status === 'active' ? 'Activo' :
                  status === 'completed' ? 'Completado' :
                  status === 'cancelled' ? 'Cancelado' : status;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  const columns = [
    { 
      key: 'id', 
      label: 'ID',
      render: (value: string) => value.substring(0, 8) + '...'
    },
    { 
      key: 'passengerName', 
      label: 'Pasajero',
    },
    { 
      key: 'driverName', 
      label: 'Chofer',
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value: string) => getStatusBadge(value)
    },
    { 
      key: 'fare', 
      label: 'Monto',
      render: (value: number) => value ? `$${value.toFixed(2)}` : 'N/A'
    },
    { 
      key: 'createdAt', 
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-MX') + ' ' + value.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'assigned', label: 'Asignado' },
    { value: 'active', label: 'Activo' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  const totalPages = Math.ceil(totalTrips / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Viajes</h1>
        <button
          onClick={loadTrips}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            placeholder="Buscar por ID, pasajero o chofer..."
            onSearch={setSearchTerm}
          />
          <StatusFilter
            options={statusOptions}
            selected={statusFilter}
            onChange={setStatusFilter}
            label="Filtrar por estado"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={trips}
        loading={loading}
      />

      {!loading && trips.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalTrips}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
