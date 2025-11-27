import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

interface Passenger {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  tripCount?: number;
}

const ITEMS_PER_PAGE = 10;

export default function PassengersList() {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

  useEffect(() => {
    loadPassengers();
  }, [currentPage]);

  const loadPassengers = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'passengers'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      if (currentPage > 1 && lastDoc) {
        q = query(
          collection(db, 'passengers'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      
      const passengersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.displayName || 'Sin nombre',
          email: data.email || 'Sin email',
          createdAt: data.createdAt?.toDate() || new Date(),
          tripCount: data.tripCount || 0,
        };
      });

      setPassengers(passengersData);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (currentPage === 1) {
        const allSnapshot = await getDocs(collection(db, 'passengers'));
        setTotalPassengers(allSnapshot.size);
      }
    } catch (error) {
      console.error('Error loading passengers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { 
      key: 'tripCount', 
      label: 'Viajes',
      render: (value: number) => value || 0
    },
    { 
      key: 'createdAt', 
      label: 'Fecha de Registro',
      render: (value: Date) => value.toLocaleDateString('es-MX')
    },
  ];

  const totalPages = Math.ceil(totalPassengers / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pasajeros</h1>
        <button
          onClick={loadPassengers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      <Table
        columns={columns}
        data={passengers}
        loading={loading}
        onRowClick={(passenger) => navigate(`/dashboard/passengers/${passenger.id}`)}
      />

      {!loading && passengers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalPassengers}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
