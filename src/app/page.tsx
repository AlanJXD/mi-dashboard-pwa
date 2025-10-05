import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import RecentActivity from '@/components/RecentActivity'
import NotificationControls from '@/components/NotificationControls'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Estadísticas */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Ventas Totales"
              value="$12,426"
              change="+12.5% desde el mes pasado"
              isPositive={true}
            />
            <StatsCard
              title="Nuevos Usuarios"
              value="234"
              change="+8.2% desde la semana pasada"
              isPositive={true}
            />
            <StatsCard
              title="Tasa de Conversión"
              value="3.2%"
              change="-0.5% desde ayer"
              isPositive={false}
            />
            <StatsCard
              title="Tiempo en Sitio"
              value="4m 32s"
              change="+12s en promedio"
              isPositive={true}
            />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gráfico falso */}
          <div className="bg-white shadow rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Ventas Mensuales
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">📊</div>
                  <p>Gráfico de ventas mensuales</p>
                  <p className="text-sm">(Aquí iría un gráfico real)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de notificación */}
          <NotificationControls />
        </div>

        {/* Segunda fila */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Actividad reciente */}
          <RecentActivity />

          {/* Tabla de datos falso */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Productos Más Vendidos
              </h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { product: 'Laptop Pro', sales: 45, revenue: '$45,000', stock: 12 },
                      { product: 'Smartphone X', sales: 78, revenue: '$31,200', stock: 5 },
                      { product: 'Tablet Air', sales: 23, revenue: '$11,500', stock: 8 },
                      { product: 'Monitor 27"', sales: 34, revenue: '$10,200', stock: 15 },
                    ].map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.sales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}