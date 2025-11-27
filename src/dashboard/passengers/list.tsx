import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [allPassengers, setAllPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    loadPassengers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, allPassengers, currentPage]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  }, [searchTerm, setSearchParams]);

  const loadPassengers = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'passengers'),
        orderBy('createdAt', 'desc')
      );

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

      setAllPassengers(passengersData);
      setTotalPassengers(passengersData.length);
    } catch (error) {
      console.error('Error loading passengers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allPassengers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (passenger) =>
          passenger.name.toLowerCase().includes(term) ||
          passenger.email.toLowerCase().includes(term)
      );
    }

    setTotalPassengers(filtered.length);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPassengers(filtered.slice(startIndex, endIndex));
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

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <SearchInput
          placeholder="Buscar por nombre o email..."
          onSearch={setSearchTerm}
        />
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
