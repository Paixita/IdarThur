"use server";

import { cookies } from "next/headers";

// Simulación de la base de datos de misiones (En producción vendría de Supabase)
const MISIONES = {
  1: { tiempo: 30, recompensa: 0.025, nombre: "Plataforma Aliada 1" },
  2: { tiempo: 40, recompensa: 0.035, nombre: "Plataforma Aliada 2" },
  3: { tiempo: 50, recompensa: 0.045, nombre: "Plataforma Aliada 3" },
  4: { tiempo: 60, recompensa: 0.055, nombre: "Plataforma Aliada 4" },
  5: { tiempo: 70, recompensa: 0.065, nombre: "Plataforma Aliada 5" },
  6: { tiempo: 80, recompensa: 0.075, nombre: "Plataforma Aliada 6" },
};

export async function iniciarMision(missionId: number) {
  // 1. Obtener timestamp exacto del servidor
  const timestampInicio = Date.now();
  
  // 2. Guardar el estado en una cookie HTTP-Only, encriptada por defecto por Next.js
  // (En un entorno real, también guardaríamos un registro en la tabla historial_clicks)
  const cookieStore = await cookies();
  cookieStore.set(`mision_activa_${missionId}`, timestampInicio.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
    maxAge: 3600 // 1 hora de validez
  });

  return { success: true, timestampInicio };
}

export async function reclamarRecompensa(missionId: number) {
  const cookieStore = await cookies();
  const cookieName = `mision_activa_${missionId}`;
  const startTimeStr = cookieStore.get(cookieName)?.value;

  // LÓGICA ANTI-TRAMPAS: Si no hay cookie, el usuario no inició por el flujo correcto
  if (!startTimeStr) {
    return { success: false, error: "No se encontró una sesión activa de misión. Flujo inválido." };
  }

  const startTime = parseInt(startTimeStr, 10);
  const currentTime = Date.now();
  const timeElapsedSegundos = (currentTime - startTime) / 1000;

  const misionData = MISIONES[missionId as keyof typeof MISIONES];
  
  if (!misionData) {
    return { success: false, error: "Misión inválida o inexistente." };
  }

  // DOBLE VALIDACIÓN: Comprobar el tiempo transcurrido REAL en el servidor
  // (Damos 2 segundos de gracia por latencia de red)
  if (timeElapsedSegundos < (misionData.tiempo - 2)) {
    // EL USUARIO MODIFICÓ EL RELOJ EN EL CLIENTE
    cookieStore.delete(cookieName);
    return { 
      success: false, 
      error: `¡Actividad sospechosa detectada! Tiempo insuficiente. Se requerían ${misionData.tiempo}s pero solo pasaron ${Math.floor(timeElapsedSegundos)}s reales. Cuenta marcada.` 
    };
  }

  // Si todo es válido, limpiamos la misión y acreditamos
  cookieStore.delete(cookieName);
  
  // Aquí ejecutaríamos el UPDATE en la tabla usuarios de Supabase para subir el saldo
  return { 
    success: true, 
    recompensa: misionData.recompensa,
    mensaje: `Misión completada exitosamente. +$${misionData.recompensa.toFixed(3)}` 
  };
}
