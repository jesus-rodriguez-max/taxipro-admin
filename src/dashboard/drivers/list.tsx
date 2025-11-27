import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';

interface Driver {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  phone?: string;
}

const ITEMS_PER_PAGE = 10;

export default function DriversList() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

  useEffect(() => {
    loadDrivers();
  }, [currentPage]);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'drivers'),
        orderBy('createdAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      );

      if (currentPage > 1 && lastDoc) {
        q = query(
          collection(db, 'drivers'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      
      const driversData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.displayName || 'Sin nombre',
          email: data.email || 'Sin email',
          status: data.status || 'unknown',
          createdAt: data.createdAt?.toDate() || new Date(),
          phone: data.phone || '',
        };
      });

      setDrivers(driversData);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }

      // Obtener total (esto es una aproximación, en producción usar aggregation)
      if (currentPage === 1) {
        const allSnapshot = await getDocs(collection(db, 'drivers'));
        setTotalDrivers(allSnapshot.size);
      }
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    const className = badges[status] || 'bg-gray-100 text-gray-800';
    const label = status === 'active' ? 'Activo' : 
                  status === 'pending' ? 'Pendiente' :
                  status === 'suspended' ? 'Suspendido' :
                  status === 'rejected' ? 'Rechazado' : status;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { 
      key: 'phone', 
      label: 'Teléfono',
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value: string) => getStatusBadge(value)
    },
    { 
      key: 'createdAt', 
      label: 'Fecha de Registro',
      render: (value: Date) => value.toLocaleDateString('es-MX')
    },
  ];

  const totalPages = Math.ceil(totalDrivers / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Choferes</h1>
        <button
          onClick={loadDrivers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>

      <Table
        columns={columns}
        data={drivers}
        loading={loading}
        onRowClick={(driver) => navigate(`/dashboard/drivers/${driver.id}`)}
      />

      {!loading && drivers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalDrivers}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
