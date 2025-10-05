// src/app/api/auto-notifications/route.js

// "Base de datos" temporal en memoria
let userTokens = [];
let notificationInterval = null;

// Notificaciones predefinidas para rotar
const notificationTemplates = [
  {
    title: "📊 Nuevos Datos Disponibles",
    body: "Se han actualizado las métricas del dashboard"
  },
  {
    title: "💰 Ventas en Tiempo Real", 
    body: "Se han procesado nuevas ventas en los últimos minutos"
  },
  {
    title: "👥 Actividad de Usuarios",
    body: "Nuevos usuarios se han registrado en la plataforma"
  },
  {
    title: "⚡ Sistema Optimizado",
    body: "El rendimiento del sistema ha mejorado"
  },
  {
    title: "🔔 Recordatorio Importante",
    body: "Revisa los reportes más recientes"
  }
];

// Iniciar el servicio de notificaciones automáticas
function startAutoNotifications() {
  if (notificationInterval) {
    console.log('⏰ Servicio de notificaciones ya está corriendo');
    return;
  }

  console.log('🚀 Iniciando notificaciones automáticas cada 2 minutos...');
  
  notificationInterval = setInterval(() => {
    if (userTokens.length > 0) {
      sendAutoNotification();
    }
  }, 2 * 60 * 1000); // 2 minutos

  // Enviar primera notificación inmediatamente
  setTimeout(() => {
    if (userTokens.length > 0) {
      sendAutoNotification();
    }
  }, 5000);
}

// Enviar notificación automática
function sendAutoNotification() {
  const randomNotification = notificationTemplates[
    Math.floor(Math.random() * notificationTemplates.length)
  ];
  
  console.log(`📤 [AUTO] Enviando notificación a ${userTokens.length} usuarios:`, randomNotification.title);
  
  // En un sistema real, aquí enviarías notificaciones push reales
  // Por ahora solo registramos en consola
  const result = {
    sent: userTokens.length,
    notification: randomNotification,
    timestamp: new Date().toISOString()
  };

  console.log('📊 Resultado notificación automática:', result);
  return result;
}

export async function POST(request) {
  try {
    const { action, token } = await request.json();

    console.log('📨 Request auto-notifications:', { action, token: token?.substring(0, 20) + '...' });

    if (action === 'register' && token) {
      // Registrar nuevo usuario
      if (!userTokens.find(t => t.token === token)) {
        userTokens.push({
          token,
          registeredAt: new Date().toISOString()
        });
        console.log('✅ Usuario registrado para notificaciones automáticas. Total:', userTokens.length);
      }
      
      // Iniciar servicio si es el primer usuario
      if (userTokens.length === 1 && !notificationInterval) {
        startAutoNotifications();
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Registrado para notificaciones automáticas',
        totalUsers: userTokens.length,
        status: 'ACTIVO',
        nextNotification: 'en 2 minutos'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'status') {
      return new Response(JSON.stringify({ 
        success: true,
        status: notificationInterval ? 'ACTIVO' : 'INACTIVO',
        totalUsers: userTokens.length,
        registeredUsers: userTokens.length,
        nextNotification: notificationInterval ? 'próxima en 2 minutos' : 'servicio inactivo',
        interval: '2 minutos'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Acción no válida' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Error en auto-notifications:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  const status = notificationInterval ? 'ACTIVO' : 'INACTIVO';
  
  return new Response(JSON.stringify({ 
    service: 'Notificaciones Automáticas',
    status: status,
    interval: '2 minutos',
    registeredUsers: userTokens.length,
    totalUsers: userTokens.length,
    nextNotification: notificationInterval ? 'próxima en 2 minutos' : 'servicio inactivo'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}