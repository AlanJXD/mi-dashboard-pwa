'use client';

import { useEffect, useCallback } from 'react';
import { dashboardNotifications } from '@/utils/notification';

export const useAutoNotifications = () => {
  const triggerRandomNotification = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const notifications = [
      () => dashboardNotifications.newUser(),
      () => dashboardNotifications.saleCompleted(`$${Math.floor(Math.random() * 5000) + 500}`),
      () => dashboardNotifications.lowStock(['Laptop Pro', 'Smartphone X', 'Tablet Air'][Math.floor(Math.random() * 3)]),
      () => dashboardNotifications.systemAlert('Sistema funcionando correctamente')
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    randomNotification();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Solo si los permisos están concedidos
    if (Notification.permission === 'granted') {
      // Notificación de bienvenida después de 3 segundos
      const welcomeTimeout = setTimeout(() => {
        dashboardNotifications.systemAlert('¡Bienvenido al Dashboard! Las notificaciones están activas.');
      }, 3000);

      // Notificación automática cada 2 minutos (opcional, para pruebas)
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad
          triggerRandomNotification();
        }
      }, 120000);

      return () => {
        clearTimeout(welcomeTimeout);
        clearInterval(interval);
      };
    }
  }, [triggerRandomNotification]);

  return { triggerRandomNotification };
};