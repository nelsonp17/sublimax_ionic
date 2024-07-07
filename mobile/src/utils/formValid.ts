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

export function formValidCategory(datos: {name: string}) {
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

export function formValidSubcategory(datos: {
	name: string,
	selectedCategory: number
}) {
	const errores: string[] = [];
	
	// formValidNotEmpty
	if (!formValidNotEmpty(datos.name)) {
		errores.push('El "nombre" no debe estar vacío.');
	}

	// minLength
	if (!minLength(datos.name, 3)) {
		errores.push('El "nombre" debe tener más de 3 carácteres.');
	}

	// formValidNotEmpty
	if (datos.selectedCategory == 0) {
		errores.push('Seleccione una categoría');
	}

	return errores.length > 0 ? listError(errores) : true;
}

export function formValidProduct(datos: {
	name: string,
	selectedSubcategory: number,
	description: string,
	tags: string,
	uuid: string,
	price: number
}) {
	const errores: string[] = [];
	
	// formValidNotEmpty
	if (!formValidNotEmpty(datos.name)) {
		errores.push('El "nombre" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.description)) {
		errores.push('La "descripción" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.tags)) {
		errores.push('La "etiquetas" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.uuid)) {
		errores.push('El "identificador" no debe estar vacío.');
	}

	// minLength
	if (!minLength(datos.name, 3)) {
		errores.push('El "nombre" debe tener más de 3 carácteres.');
	}
	if (!minLength(datos.uuid, 3)) {
		errores.push('El "identificador" debe tener más de 3 carácteres.');
	}

	// formValidNotEmpty
	if (datos.selectedSubcategory == 0) {
		errores.push('Seleccione una categoría');
	}
	if (datos.price == 0) {
		errores.push('Indique el precio del producto.');
	}

	return errores.length > 0 ? listError(errores) : true;
}

export function formValidImage(datos: {
	src: string,
	title: string,
	alt: string,
	product_id: number,
}) {
	const errores: string[] = [];
	
	// formValidNotEmpty
	if (!formValidNotEmpty(datos.src)) {
		errores.push('El "src" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.title)) {
		errores.push('El "title" no debe estar vacío.');
	}
	if (!formValidNotEmpty(datos.alt)) {
		errores.push('El "alt" no debe estar vacío.');
	}

	// formValidNotEmpty
	if (datos.product_id == 0) {
		errores.push('Seleccione un product');
	}

	return errores.length > 0 ? listError(errores) : true;
}