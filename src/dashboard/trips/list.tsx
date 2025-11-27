import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

  useEffect(() => {
    loadTrips();
  }, [currentPage]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'trips'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      if (currentPage > 1 && lastDoc) {
        q = query(
          collection(db, 'trips'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

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

      setTrips(tripsData);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (currentPage === 1) {
        const allSnapshot = await getDocs(collection(db, 'trips'));
        setTotalTrips(allSnapshot.size);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
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
