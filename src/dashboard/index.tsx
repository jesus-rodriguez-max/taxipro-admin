export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Choferes Activos</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Viajes Activos</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pasajeros Registrados</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Choferes Suspendidos</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">0</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pendientes de Documentos</h3>
        <p className="text-gray-500">Sin choferes pendientes</p>
      </div>
    </div>
  );
}
