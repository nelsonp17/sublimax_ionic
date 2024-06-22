// Utilizando Intl.DateTimeFormat
export const formatDateToHuman = (fechaString:string) => {
    //const fechaString = "2024-06-21T10:43:00.032539+00:00";
    const fecha = new Date(fechaString);
    const opcionesHora = { hour: '2-digit', minute: '2-digit' };
    const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const horaFormateada = new Intl.DateTimeFormat('en-US', opcionesHora).format(fecha);
    const fechaFormateada = new Intl.DateTimeFormat('en-US', opcionesFecha).format(fecha);
    const result = `${horaFormateada} ${fechaFormateada}`
    return result;

}

export function formValidNotEmpty(valor: string): boolean {
    return valor.trim() !== '';
}
  
export function isNumber(valor: string): boolean {
    return !isNaN(parseFloat(valor)) && isFinite(parseFloat(valor));
}

export function maxLength(cadena: string, longitudMaxima: number): boolean {
    return cadena.length <= longitudMaxima;
}

export function minLength(cadena: string, longitudMinima: number): boolean {
    return cadena.length >= longitudMinima;
}
  
export function listError(errores: string[]): string {
    return `<ul>${errores.map((error) => `<li>${error}</li>`).join('')}</ul>`;
}
