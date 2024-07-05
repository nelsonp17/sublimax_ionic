
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

export function generateUniqueProductID(prefix:string) {
    //const prefix = "P"; // Prefijo para el identificador
    const randomSuffix = Math.floor(Math.random() * 999) + 1; // Sufijo aleatorio entre 1 y 999
    const paddedSuffix = randomSuffix.toString().padStart(3, "0"); // Relleno con ceros a la izquierda

    return prefix + "-" + paddedSuffix; // Combina el prefijo y el sufijo con guion
}

export function saveToStorage<T>(key: string, data: string | number | boolean | T) {
    try {
        const tipo = typeof data 
        if(tipo== 'number' || tipo == 'boolean' || tipo == 'string'){
            localStorage.setItem(key, data);
        }else if(tipo == 'object'){
            localStorage.setItem(key, JSON.stringify(data));
        }
        console.log(`Datos guardados en storage: ${key}`);
    } catch (error) {
        console.error(`Error al guardar datos en storage: ${error}`);
    }
}

export function readFromStorage<T>(key: string): string | number | boolean | T | null {
    const dataString = localStorage.getItem(key);
    try {
        if (dataString) {
            return JSON.parse(dataString) as T;
        } else {
            console.log(`No se encontraron datos en storage para la clave: ${key}`);
            return null;
        }
    } catch (error) {
        try {
            if (dataString) {
                return dataString;
            } else {
                console.log(`No se encontraron datos en storage para la clave: ${key}`);
                return null;
            }
        } catch (error) {
            console.error(`Error al leer datos del storage: ${error}`);
            return null;
        }
    }
}

export const buscarCoincidencias = (nombreBuscado: string) => {
    return categorys.value.filter((category) =>
        category.name.toLowerCase().includes(nombreBuscado.toLowerCase())
    );
};

export const changeTagHTML = (elemRef: any, nameTag: string, id: string) => {
    // Cambia la etiqueta
    const htmlElement = document.createElement(nameTag);
    htmlElement.setAttribute("id", id)
    htmlElement.innerHTML = elemRef.innerHTML;
    elemRef.parentNode.replaceChild(htmlElement, elemRef);
}
export const removeSpaceString = (str: string)=>{
    return str.replace(/ /g, "")
}