const activities = [
    { id: 1, user: 'Juan Pérez', action: 'completó el reporte mensual', time: 'Hace 5 min' },
    { id: 2, user: 'María García', action: 'subió nuevos archivos', time: 'Hace 15 min' },
    { id: 3, user: 'Carlos López', action: 'actualizó el dashboard', time: 'Hace 1 hora' },
    { id: 4, user: 'Ana Martínez', action: 'creó nuevo proyecto', time: 'Hace 2 horas' },
  ]
  
  export default function RecentActivity() {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }