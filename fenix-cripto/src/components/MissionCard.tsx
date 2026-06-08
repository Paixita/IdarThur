"use client";

import { useState, useEffect } from "react";
import { Star, Clock, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { iniciarMision, reclamarRecompensa } from "@/app/actions/mission";

interface MissionCardProps {
  id: number;
  tiempo: number;
  recompensa: number;
  nombre: string;
}

export default function MissionCard({ id, tiempo, recompensa, nombre }: MissionCardProps) {
  const [estado, setEstado] = useState<"IDLE" | "ACTIVE" | "VERIFYING" | "COMPLETED" | "ERROR">("IDLE");
  const [timeLeft, setTimeLeft] = useState(tiempo);
  const [mensaje, setMensaje] = useState("");

  // Efecto del temporizador en el frontend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (estado === "ACTIVE" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (estado === "ACTIVE" && timeLeft <= 0) {
      handleReclamar();
    }
    return () => clearInterval(timer);
  }, [estado, timeLeft]);

  const handleIniciar = async () => {
    setEstado("ACTIVE");
    setTimeLeft(tiempo);
    
    // Disparamos la acción en el backend para iniciar el cronómetro seguro
    await iniciarMision(id);
    
    // Aquí abriríamos la web patrocinada en otra pestaña
    // window.open('https://plataforma-aliada.com', '_blank');
  };

  const handleReclamar = async () => {
    setEstado("VERIFYING");
    
    // Al terminar, el frontend pide validar. Si el usuario alteró el Date() local,
    // el backend lo rechazará porque compara contra su propio Timestamp.
    const result = await reclamarRecompensa(id);
    
    if (result.success) {
      setEstado("COMPLETED");
      setMensaje(result.mensaje || "Recompensa reclamada");
    } else {
      setEstado("ERROR");
      setMensaje(result.error || "Error de validación");
    }
  };

  return (
    <div className={`group relative bg-surface border rounded-xl p-5 flex flex-col gap-4 transition-all hover:-translate-y-1 ${
      estado === "ERROR" ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
      estado === "COMPLETED" ? "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
      "border-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,85,0,0.15)]"
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center font-bold text-gray-300">
            C{id}
          </div>
          <div>
            <h4 className={`font-semibold transition-colors ${estado === "COMPLETED" ? "text-green-400" : "text-white group-hover:text-primary"}`}>
              {nombre}
            </h4>
            <div className="flex text-yellow-500 mt-1">
              {[...Array(4)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              <Star size={12} className={id % 2 === 0 ? "text-gray-600" : "fill-currentColor"} />
            </div>
          </div>
        </div>
        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded border border-primary/20">
          Premium
        </span>
      </div>
      
      <p className="text-sm text-gray-400 line-clamp-3 min-h-[60px]">
        {estado === "ERROR" ? <span className="text-red-400 font-medium">{mensaje}</span> :
         estado === "COMPLETED" ? <span className="text-green-400 font-medium">{mensaje}</span> :
         "Visita esta plataforma de finanzas descentralizadas y mantente activo por el tiempo requerido para reclamar tu recompensa."}
      </p>
      
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">Recompensa</span>
          <span className="font-mono font-bold text-green-400">+${recompensa.toFixed(3)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            {estado === "ACTIVE" ? "Restante" : "Tiempo"}
          </span>
          <span className={`font-mono font-bold flex items-center gap-1 ${estado === "ACTIVE" ? "text-primary animate-pulse" : "text-white"}`}>
            <Clock size={12} className={estado === "ACTIVE" ? "text-primary" : "text-gray-400"} /> 
            {estado === "ACTIVE" ? `${timeLeft}s` : `${tiempo}s`}
          </span>
        </div>
      </div>

      {estado === "IDLE" && (
        <button onClick={handleIniciar} className="w-full mt-2 py-2.5 bg-white/5 hover:bg-primary/20 text-white hover:text-primary border border-white/10 hover:border-primary/50 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
          <span>Iniciar Misión</span>
          <ChevronRight size={16} />
        </button>
      )}

      {estado === "ACTIVE" && (
        <button disabled className="w-full mt-2 py-2.5 bg-surface-hover text-gray-400 border border-white/5 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
          <Loader2 size={16} className="animate-spin" />
          <span>Validando visita... ({timeLeft}s)</span>
        </button>
      )}

      {estado === "VERIFYING" && (
        <button disabled className="w-full mt-2 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-lg font-medium flex items-center justify-center gap-2 cursor-wait">
          <Loader2 size={16} className="animate-spin" />
          <span>Verificando en servidor...</span>
        </button>
      )}

      {estado === "COMPLETED" && (
        <div className="w-full mt-2 py-2.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg font-medium flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          <span>Completada</span>
        </div>
      )}

      {estado === "ERROR" && (
        <button onClick={() => setEstado("IDLE")} className="w-full mt-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/50 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  );
}
