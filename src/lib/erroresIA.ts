// src/lib/erroresIA.ts
// Traduce errores tecnicos de la IA (Gemini) o de generacion de imagen
// a mensajes amigables. Mitigacion de riesgos R04 (falla de la API de IA)
// y R11 (indisponibilidad del servicio externo).

export function mensajeErrorIA(error: unknown): string {
  const texto = error instanceof Error ? error.message : String(error);

  if (texto.includes("429") || texto.toLowerCase().includes("quota")) {
    return "El asistente de IA alcanzo su limite de uso por ahora. Intenta nuevamente en unos minutos.";
  }
  if (texto.includes("404") || texto.toLowerCase().includes("not found")) {
    return "El asistente de IA no esta disponible en este momento. Intenta nuevamente mas tarde.";
  }
  if (
    texto.toLowerCase().includes("fetch") ||
    texto.toLowerCase().includes("network") ||
    texto.toLowerCase().includes("timeout")
  ) {
    return "No pudimos conectarnos con el servicio de IA. Verifica tu conexion e intenta de nuevo.";
  }
  return "Ocurrio un problema al procesar tu solicitud. Intenta nuevamente en unos momentos.";
}

export function mensajeErrorImagen(error: unknown): string {
  const texto = error instanceof Error ? error.message : String(error);
  if (texto.toLowerCase().includes("fetch") || texto.toLowerCase().includes("timeout")) {
    return "No se pudo generar la vista conceptual en este momento.";
  }
  return "La vista conceptual no esta disponible por ahora.";
}
