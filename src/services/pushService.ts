import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 🔥 TU CONFIGURACIÓN DE FIREBASE - REEMPLAZA CON TUS DATOS
const firebaseConfig = {
  apiKey: "AIzaSyAaCGELylyG_tx3rNWm8Ref8Kx4be_TrT4",
  authDomain: "mi-dashboard-pwa-59e97.firebaseapp.com",
  projectId: "mi-dashboard-pwa-59e97",
  storageBucket: "mi-dashboard-pwa-59e97.firebasestorage.app",
  messagingSenderId: "801735868133",
  appId: "1:801735868133:web:0d01c2cd892203ad9e1e0c",
  measurementId: "G-SQK3JH62PL"
};

// 🔥 TU VAPID KEY - USA LA PRIMERA QUE ME DISTE
const VAPID_KEY = "BMA-uNel55_quBhohfPpaj779VEL2lfhYA8CzgkzVtsOIIUuZN4cWsH7T9R0kbp8AQEmhOW7ApBxK1MkhFy8rTo";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Verificar si está en localhost
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const requestPushPermission = async (): Promise<string | null> => {
  try {
    console.log('🚀 Solicitando permisos push...');
    
    // Verificar soporte
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('❌ Este navegador no soporta notificaciones push');
      return null;
    }

    // Solicitar permisos de notificación
    console.log('🔔 Solicitando permisos al usuario...');
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('❌ Usuario denegó los permisos');
      return null;
    }

    console.log('✅ Permisos concedidos, obteniendo token FCM...');

    // Obtener token FCM
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready
    });

    if (!token) {
      console.log('❌ No se pudo obtener el token FCM');
      return null;
    }

    console.log('🎯 Token FCM obtenido exitosamente');
    console.log('📝 Token:', token);
    
    // Guardar token
    await saveTokenToBackend(token);
    
    return token;
  } catch (error) {
    console.error('💥 Error crítico obteniendo token FCM:', error);
    
    // Fallback para desarrollo
    if (isLocalhost) {
      console.log('🏠 Localhost - generando token mock');
      const mockToken = `mock-token-localhost-${Date.now()}`;
      await saveTokenToBackend(mockToken);
      return mockToken;
    }
    
    return null;
  }
};

// Guardar token en localStorage (en producción enviarías a tu backend)
const saveTokenToBackend = async (token: string) => {
  console.log('💾 Guardando token:', token);
  localStorage.setItem('fcm_token', token);
  localStorage.setItem('fcm_token_timestamp', Date.now().toString());
  
  // Aquí en una app real enviarías el token a tu servidor
  // await fetch('/api/save-token', { method: 'POST', body: JSON.stringify({ token }) });
};

// Escuchar mensajes cuando la app está en primer plano
export const setupForegroundMessages = () => {
  console.log('👀 Configurando listener de mensajes en primer plano...');
  
  onMessage(messaging, (payload) => {
    console.log('📱 Mensaje push recibido en primer plano:', payload);
    
    if (payload.notification) {
      console.log('🔔 Mostrando notificación en primer plano');
      new Notification(payload.notification.title || 'Mi Dashboard', {
        body: payload.notification.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'foreground-push'
      });
    }
  });
};

// Verificar soporte
export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Obtener token guardado
export const getStoredToken = (): string | null => {
  return localStorage.getItem('fcm_token');
};

// Verificar si está activo
export const isPushActive = (): boolean => {
  const token = getStoredToken();
  return !!token;
};

// Para testing: enviar notificación push de prueba
export const sendTestPush = async (title: string, body: string) => {
  const token = getStoredToken();
  if (!token) {
    console.log('❌ No hay token para enviar prueba');
    return false;
  }

  // En una app real, aquí llamarías a tu backend
  console.log('🧪 Enviando push de prueba:', { title, body, token });
  
  // Simular envío (en producción esto lo haría tu servidor)
  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: 'test-push'
        });
      });
    }
  }, 3000);
  
  return true;
};