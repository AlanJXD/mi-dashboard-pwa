'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, dashboardNotifications } from '@/utils/notification';

export default function NotificationControls() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
      console.log('🏠 Componente montado. Permisos:', Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    console.log('🔄 Iniciando solicitud de permisos...');
    setLoading(true);
    
    try {
      const granted = await requestNotificationPermission();
      console.log('🎯 Resultado de permisos:', granted);
      setPermission(granted ? 'granted' : 'denied');
      
      if (!granted && Notification.permission === 'denied') {
        setShowInstructions(true);
      }
    } catch (error) {
      console.error('💥 Error al solicitar permisos:', error);
    } finally {
      setLoading(false);
    }
  };

  const testNotifications = {
    newUser: () => {
      console.log('🧪 Probando notificación: Nuevo usuario');
      dashboardNotifications.newUser();
    },
    sale: () => {
      console.log('🧪 Probando notificación: Venta');
      dashboardNotifications.saleCompleted('$1,250');
    },
    lowStock: () => {
      console.log('🧪 Probando notificación: Stock bajo');
      dashboardNotifications.lowStock('Smartphone X');
    },
    custom: () => {
      console.log('🧪 Probando notificación: Custom');
      dashboardNotifications.systemAlert('Esta es una notificación de prueba del dashboard');
    }
  };

  const resetPermissions = () => {
    // Esto no puede resetear los permisos programáticamente por seguridad
    // Pero podemos guiar al usuario
    setShowInstructions(true);
  };

  // Evitar renderizado en el servidor
  if (!mounted) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          ❌ Tu navegador no soporta notificaciones push.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">🔔 Controles de Notificación</h3>
      
      {/* Estado de permisos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Permisos de notificación:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            permission === 'granted' ? 'bg-green-100 text-green-800' :
            permission === 'denied' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {permission === 'granted' ? '✅ Concedido' : permission === 'denied' ? '❌ Denegado' : '⏳ Pendiente'}
          </span>
        </div>
        
        {permission === 'default' && (
          <button
            onClick={handleRequestPermission}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md transition-colors text-sm ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Solicitando...' : '🔔 Activar Notificaciones'}
          </button>
        )}

        {permission === 'denied' && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm font-medium">
                ❌ Los permisos de notificación están bloqueados
              </p>
              <p className="text-red-700 text-xs mt-1">
                Debes desbloquearlos manualmente en la configuración de tu navegador.
              </p>
            </div>
            
            <button
              onClick={resetPermissions}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors text-sm"
            >
              🛠️ Mostrar Instrucciones
            </button>
          </div>
        )}
      </div>

      {/* Instrucciones para desbloquear */}
      {showInstructions && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            🛠️ Cómo desbloquear notificaciones:
          </h4>
          <div className="text-xs text-blue-800 space-y-2">
            <p><strong>Chrome/Edge:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Haz clic en el ícono de candado 🔒 en la barra de direcciones</li>
              <li>En "Notificaciones", cambia de "Bloquear" a "Permitir"</li>
              <li>O ve a Configuración → Privacidad → Configuración de sitios → Notificaciones</li>
            </ul>
            
            <p><strong>Firefox:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Haz clic en el ícono de candado 🔒 en la barra de direcciones</li>
              <li>Cambia "Notificaciones" de "Bloquear" a "Permitir"</li>
            </ul>
            
            <p><strong>Safari:</strong></p>
            <ul className="list-disc list-inside ml-2">
              <li>Safari → Preferencias → Sitios web → Notificaciones</li>
              <li>Busca este sitio y cambia a "Permitir"</li>
            </ul>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              Cerrar instrucciones
            </button>
          </div>
        </div>
      )}

      {/* Botones de prueba */}
      {permission === 'granted' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">🧪 Probar notificaciones:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={testNotifications.newUser}
              className="bg-green-100 text-green-700 py-2 px-3 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
            >
              🎉 Nuevo Usuario
            </button>
            
            <button
              onClick={testNotifications.sale}
              className="bg-blue-100 text-blue-700 py-2 px-3 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              💰 Venta Completa
            </button>
            
            <button
              onClick={testNotifications.lowStock}
              className="bg-yellow-100 text-yellow-700 py-2 px-3 rounded-md hover:bg-yellow-200 transition-colors text-sm font-medium"
            >
              ⚠️ Stock Bajo
            </button>
            
            <button
              onClick={testNotifications.custom}
              className="bg-purple-100 text-purple-700 py-2 px-3 rounded-md hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              🔔 Alerta Sistema
            </button>
          </div>
        </div>
      )}

      {/* Información de debug */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 Abre la consola (F12) para ver los logs de las notificaciones
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Estado actual: <strong>{permission}</strong>
        </p>
      </div>
    </div>
  );
}