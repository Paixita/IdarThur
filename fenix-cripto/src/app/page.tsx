import Image from "next/image";
import { Wallet, Flame, Clock, ShieldCheck } from "lucide-react";
import MissionCard from "@/components/MissionCard";

export default function Home() {
  const misiones = [
    { id: 1, tiempo: 30, recompensa: 0.025, nombre: "Plataforma Aliada 1" },
    { id: 2, tiempo: 40, recompensa: 0.035, nombre: "Plataforma Aliada 2" },
    { id: 3, tiempo: 50, recompensa: 0.045, nombre: "Plataforma Aliada 3" },
    { id: 4, tiempo: 60, recompensa: 0.055, nombre: "Plataforma Aliada 4" },
    { id: 5, tiempo: 70, recompensa: 0.065, nombre: "Plataforma Aliada 5" },
    { id: 6, tiempo: 80, recompensa: 0.075, nombre: "Plataforma Aliada 6" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/30 glow-box">
            <Image src="/logo.png" alt="FenixCripto Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            FENIX<span className="text-primary glow-text">CRIPTO</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-gray-400 font-medium">Saldo Actual</span>
            <span className="text-lg font-mono font-bold text-green-400">$12.4500</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-500 hover:to-primary-hover rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,85,0,0.4)]">
            <Wallet size={18} />
            <span>Retirar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-10">
        
        {/* LEVEL BANNER */}
        <section className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-hover border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-5 z-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary text-primary glow-box">
              <Flame size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Gremio de Cazadores</p>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Nivel Plata
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300 font-mono">Lvl 14</span>
              </h2>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col gap-2 z-10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progreso a Nivel Fénix</span>
              <span className="text-primary font-bold">75%</span>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-orange-600 to-primary w-3/4 rounded-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">Gana 250 XP más para subir de rango</p>
          </div>
        </section>

        {/* EXPLORATION CARDS GRID */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} />
              Directorio de Misiones
            </h3>
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <Clock size={14} /> Se renuevan en: <span className="font-mono text-white">04:23:10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {misiones.map((mision) => (
              <MissionCard 
                key={mision.id}
                id={mision.id}
                tiempo={mision.tiempo}
                recompensa={mision.recompensa}
                nombre={mision.nombre}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
