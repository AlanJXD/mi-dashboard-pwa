// Utilidad para solicitar permisos de notificación
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') {
      console.log('❌ Window no está disponible (servidor)');
      return false;
    }
    
    if (!('Notification' in window)) {
      console.log('❌ Este navegador no soporta notificaciones');
      return false;
    }
  
    console.log('📢 Estado actual de notificaciones:', Notification.permission);
  
    if (Notification.permission === 'granted') {
      console.log('✅ Permisos ya concedidos');
      return true;
    }
  
    if (Notification.permission !== 'denied') {
      console.log('🔔 Solicitando permisos...');
      const permission = await Notification.requestPermission();
      console.log('📢 Respuesta del usuario:', permission);
      return permission === 'granted';
    }
  
    console.log('❌ Permisos denegados previamente');
    return false;
  };
  
  // Función para mostrar notificaciones
  export const showNotification = (title: string, options?: NotificationOptions) => {
    if (typeof window === 'undefined') {
      console.log('❌ Window no disponible para notificación:', title);
      return;
    }
    
    console.log('🔔 Intentando mostrar notificación:', title);
    
    if (Notification.permission === 'granted') {
      console.log('✅ Creando notificación...');
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      });
      
      notification.onclick = () => {
        console.log('👆 Notificación clickeada:', title);
        window.focus();
      };
      
      console.log('✅ Notificación creada:', title);
    } else {
      console.log('❌ Permisos no concedidos para:', title);
    }
  };
  
  // Notificaciones predefinidas para el dashboard
  export const dashboardNotifications = {
    newUser: () => {
      console.log('🎉 Disparando notificación: Nuevo usuario');
      showNotification('🎉 Nuevo usuario registrado', {
        body: 'Un nuevo usuario se ha unido a la plataforma',
        tag: 'new-user'
      });
    },
  
    saleCompleted: (amount: string) => {
      console.log('💰 Disparando notificación: Venta completada', amount);
      showNotification('💰 Venta completada', {
        body: `Se ha procesado una venta de ${amount}`,
        tag: 'sale-completed'
      });
    },
  
    lowStock: (product: string) => {
      console.log('⚠️ Disparando notificación: Stock bajo', product);
      showNotification('⚠️ Stock bajo', {
        body: `El producto "${product}" tiene stock bajo`,
        tag: 'low-stock'
      });
    },
  
    systemAlert: (message: string) => {
      console.log('🔔 Disparando notificación: Alerta sistema', message);
      showNotification('🔔 Alerta del sistema', {
        body: message,
        tag: 'system-alert'
      });
    }
  };