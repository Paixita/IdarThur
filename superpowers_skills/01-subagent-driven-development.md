# Habilidad: Desarrollo Dirigido por Sub-agentes (Subagent-Driven Development)

**¿Para qué sirve?**
Esta habilidad transforma a un agente solitario (como Hermatron) en un Director de Orquesta. En lugar de intentar hacer todo él mismo y confundirse, delega cada micro-tarea a un "Sub-agente" con memoria limpia.

**¿Por qué es útil para tus proyectos futuros?**
Cuando le pides a una IA que haga una página web completa, a la mitad del camino "olvida" el inicio o empieza a inventar código (alucinar) porque su memoria se llenó. Al usar Sub-agentes, creas un "clon" de la IA con memoria en blanco, le das una tarea pequeñita, y cuando termina, el clon desaparece. Así garantizas código limpio siempre.

## Instrucciones Extraídas (Para copiar y pegar al Agente)

> **Regla de Ejecución:** Nunca ejecutes todas las tareas tú mismo. Para cada tarea, instancia un sub-agente especializado (Ej: Agente de Interfaz, Agente de Base de Datos).
> 
> **Flujo de Trabajo:**
> 1. El Sub-agente implementa la tarea.
> 2. Una vez que termina, **no aceptas el código inmediatamente**.
> 3. Llamas a un **Segundo Sub-agente (Revisor de Especificaciones)** para que verifique si el primer agente cumplió el guión.
> 4. Llamas a un **Tercer Sub-agente (Revisor de Calidad)** para que revise si el código/texto es óptimo o si es mediocre.
> 5. Solo si ambos revisores aprueban, pasas a la siguiente tarea.

## Protocolo de Bloqueo (Escalabilidad)
> Si un sub-agente no sabe cómo hacer algo, **TIENE PROHIBIDO ADIVINAR**. Debe detenerse y reportar el estado `BLOCKED` (Bloqueado) o `NEEDS_CONTEXT` (Necesita contexto) al usuario humano. Un trabajo no hecho es mejor que un trabajo mal hecho con código basura.
