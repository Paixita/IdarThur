"use client";
import { useEffect } from 'react';

export default function NotificationPrompt() {
  useEffect(() => {
    // Verificamos si el navegador soporta notificaciones
    if (typeof window !== "undefined" && "Notification" in window) {
      // Esperamos 5 segundos antes de mostrar el recuadro gris
      // Esto es una buena práctica para no asustar al usuario apenas entra
      const timer = setTimeout(() => {
        if (Notification.permission === "default") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              console.log("¡Excelente! El usuario permitió las notificaciones.");
              // En el futuro, aquí se inicializará OneSignal o Firebase
            } else {
              console.log("El usuario bloqueó o ignoró las notificaciones.");
            }
          });
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return null; // Este componente es invisible, solo ejecuta código en segundo plano
}
