"use client";

import { useState, useEffect } from "react";
import {
  requestPushPermission,
  setupForegroundMessages,
  isPushSupported,
  getStoredToken,
  isPushActive,
  sendTestPush,
  registerForAutoNotifications,
  getAutoNotificationsStatus,
} from "@/services/pushService";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [isProd, setIsProd] = useState(false);
  const [autoStatus, setAutoStatus] = useState<any>(null);
  const [loadingAuto, setLoadingAuto] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const supported = isPushSupported();
      setIsSupported(supported);
      setIsProd(!window.location.hostname.includes("localhost"));

      if (supported) {
        setupForegroundMessages();
        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);
          setStatus("success");

          // Auto-registrar para notificaciones automáticas
          await registerForAutoNotifications(storedToken);
          await fetchAutoStatus();
        }
      }
    };

    initialize();
  }, []);

  const fetchAutoStatus = async () => {
    setLoadingAuto(true);
    try {
      const status = await getAutoNotificationsStatus();
      setAutoStatus(status);
    } catch (error) {
      console.error("Error obteniendo estado automático:", error);
    } finally {
      setLoadingAuto(false);
    }
  };

  const handleEnablePush = async () => {
    setStatus("loading");
    try {
      const newToken = await requestPushPermission();
      if (newToken) {
        setToken(newToken);
        setStatus("success");
        
        // Registrar para notificaciones automáticas
        await registerForAutoNotifications(newToken);
        await fetchAutoStatus();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error habilitando push:", error);
      setStatus("error");
    }
  };

  const handleTestPush = async () => {
    const success = await sendTestPush(
      "🚀 Prueba Push Exitosa",
      "¡Las notificaciones push están funcionando correctamente!"
    );

    if (success) {
      alert("✅ Notificación de prueba enviada. Debería llegar en 3 segundos.");
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
        📱 Notificaciones Push {isProd ? "(Producción)" : "(Desarrollo)"}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : status === "error"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status === "success"
              ? "✅ Activado"
              : status === "error"
              ? "❌ Error"
              : "⏳ Pendiente"}
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

        {status !== "success" ? (
          <button
            onClick={handleEnablePush}
            disabled={status === "loading"}
            className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
              status === "loading"
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {status === "loading"
              ? "Activando..."
              : "📱 Activar Notificaciones Push"}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleTestPush}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              🧪 Enviar Prueba Push
            </button>

            {/* Sección de Notificaciones Automáticas */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    ⏰ Notificaciones Automáticas
                  </p>
                  <p className="text-xs text-blue-700">
                    Recibe notificaciones cada 2 minutos
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {loadingAuto ? (
                    <div className="animate-pulse">
                      <div className="w-8 h-4 bg-blue-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          autoStatus?.status === "ACTIVO"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {autoStatus?.status || "CARGANDO"}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          autoStatus?.status === "ACTIVO"
                            ? "bg-green-500 animate-pulse"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                    </>
                  )}
                </div>
              </div>

              {!loadingAuto && autoStatus && (
                <div className="text-xs text-blue-600 space-y-1">
                  <p>
                    <strong>Intervalo:</strong> Cada 2 minutos
                  </p>
                  <p>
                    <strong>Usuarios registrados:</strong>{" "}
                    {autoStatus.registeredUsers || 0}
                  </p>
                  <p>
                    <strong>Próxima notificación:</strong>{" "}
                    {autoStatus.nextNotification || "En 2 minutos"}
                  </p>
                </div>
              )}

              {loadingAuto && (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                  <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                </div>
              )}

              <div className="mt-3 text-xs text-blue-600 bg-blue-100 p-2 rounded">
                <p>
                  💡 Recibirás notificaciones automáticas cada 2 minutos con
                  información actualizada del dashboard.
                </p>
              </div>
            </div>

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
          <p>
            <strong>🔥 Configuración Firebase:</strong> Correcta
          </p>
          <p>
            <strong>🔑 VAPID Key:</strong> Configurada
          </p>
          <p>
            <strong>🌐 Entorno:</strong>{" "}
            {isProd ? "Producción (HTTPS)" : "Desarrollo"}
          </p>
        </div>
      </div>
    </div>
  );
}