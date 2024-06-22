import {formValidNotEmpty, isNumber, maxLength, minLength, listError} from './utils';

export function formValidEnv(datos: {name: string, value: string, description: string}) {
	const errores: string[] = [];
	
	// formValidNotEmpty
	if (!formValidNotEmpty(datos.name)) {
		errores.push('El "nombre" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.value)) {
		errores.push('El "valor" no debe estar vacío.');
	}

	// minLength
	if (!minLength(datos.name, 3)) {
		errores.push('El "nombre" debe tener más de 3 carácteres.');
	}
	if (!minLength(datos.value, 3)) {
		errores.push('El "valor" debe tener más de 3 carácteres.');
	}

	return errores.length > 0 ? listError(errores) : true;
}

export function formValidCategory(datos: {name: string, value: string}) {
	const errores: string[] = [];
	
	// formValidNotEmpty
	if (!formValidNotEmpty(datos.name)) {
		errores.push('El "nombre" no debe estar vacío.');
	}

	// minLength
	if (!minLength(datos.name, 3)) {
		errores.push('El "nombre" debe tener más de 3 carácteres.');
	}

	return errores.length > 0 ? listError(errores) : true;
}