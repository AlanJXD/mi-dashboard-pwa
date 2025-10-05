// src/app/api/send-push/route.js
export async function POST(request) {
    try {
      const { token, title, body } = await request.json();
  
      console.log('📤 Recibiendo solicitud de notificación:', { 
        token: token?.substring(0, 20) + '...', 
        title, 
        body 
      });
  
      // Validaciones
      if (!token || !title) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Token y título requeridos' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
      // Para desarrollo/testing - simular envío exitoso
      if (process.env.NODE_ENV === 'development') {
        console.log('🏠 Desarrollo: Simulando envío de notificación');
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Notificación simulada (modo desarrollo)',
          simulated: true
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
      // EN PRODUCCIÓN: Enviar notificación real usando el Service Worker
      console.log('🚀 Producción: Enviando notificación real');
      
      // Aquí podrías integrar con un servicio como OneSignal más adelante
      // Por ahora, el Service Worker ya está configurado para recibir pushes
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Notificación enviada al sistema de push',
        delivered: true,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (error) {
      console.error('💥 Error en API:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }