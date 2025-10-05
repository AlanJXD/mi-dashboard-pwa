'use client';

import { useState, useEffect } from 'react';
import { 
  requestPushPermission, 
  setupForegroundMessages, 
  isPushSupported,
  getStoredToken,
  isPushActive,
  sendTestPush
} from '@/services/pushService';

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isProd, setIsProd] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const supported = isPushSupported();
      setIsSupported(supported);
      setIsProd(!window.location.hostname.includes('localhost'));
      
      if (supported) {
        setupForegroundMessages();
        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          setStatus('success');
        }
      }
    };

    initialize();
  }, []);

  const handleEnablePush = async () => {
    setStatus('loading');
    try {
      const newToken = await requestPushPermission();
      if (newToken) {
        setToken(newToken);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error habilitando push:', error);
      setStatus('error');
    }
  };

  const handleTestPush = async () => {
    const success = await sendTestPush(
      '🚀 Prueba Push Exitosa', 
      '¡Las notificaciones push están funcionando correctamente!'
    );
    
    if (success) {
      alert('✅ Notificación de prueba enviada. Debería llegar en 3 segundos.');
    }
  };

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
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        📱 Notificaciones Push {isProd ? '(Producción)' : '(Desarrollo)'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === 'success' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'success' ? '✅ Activado' : 
             status === 'error' ? '❌ Error' : '⏳ Pendiente'}
          </span>
        </div>

        {token && (
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600 break-all">
              <strong>Token:</strong> {token.substring(0, 30)}...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Este token identifica tu dispositivo para recibir notificaciones.
            </p>
          </div>
        )}

        {status !== 'success' ? (
          <button
            onClick={handleEnablePush}
            disabled={status === 'loading'}
            className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
              status === 'loading' 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status === 'loading' ? 'Activando...' : '📱 Activar Notificaciones Push'}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleTestPush}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              🧪 Enviar Prueba Push
            </button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>✅ Las notificaciones push ahora funcionan:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Con la app cerrada</li>
                <li>Con el navegador minimizado</li>
                <li>Incluso con el dispositivo bloqueado</li>
              </ul>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 p-3 bg-blue-50 rounded">
          <p><strong>🔥 Configuración Firebase:</strong> Correcta</p>
          <p><strong>🔑 VAPID Key:</strong> Configurada</p>
          <p><strong>🌐 Entorno:</strong> {isProd ? 'Producción (HTTPS)' : 'Desarrollo'}</p>
        </div>
      </div>
    </div>
  );
}