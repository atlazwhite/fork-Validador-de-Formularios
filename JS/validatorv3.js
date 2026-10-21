//Patrones RegEx
const texto_largo = /\b[aA-zZ0-9 áéíóú \-:.,/()]+\b/g;
const numero_entero = /[0-9]/g;
const numero_flotante = /[0-9\.]/g;
//const nombre = /[aA-zZ áéíóú]/g; Letras
const nombre_un = /\b[aA-zZ áéíóú]+\b/g;
//const correo_elec = /^([A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,})$/;
const correo_elec = /^([aA-zZ0-9]+@[aA-zZ0-9]+\.[aA-zZ]{2,})$/g;
//const num_tlf = /^(\d{3}-\d{3}-\d{4})/g;
const num_tlf = /^(\d{4}-\d{3}-\d{4})/g;
const tiempo_n = /^(\d{2}:\d{2})/g;
const fecha_n = /^(\d{4}-\d{2}-\d{2})/g;
const regex = {
	nombre : nombre_un,
	texto : texto_largo,
	numero : numero_entero,
	numero_f : numero_flotante,
	correo : correo_elec,
	numero_tlf : num_tlf,
	fecha : fecha_n,
	hora : tiempo_n
}
//
function ultimate_validator_v3 (datos) {
	console.log(datos);
	let cont = -1; 
	const ids = Object.keys(datos);
	const valores = Object.values(datos);
	let new_values = {};
	let errors = {};
	let privilegio = {};
	ids.forEach((ID) => {
		cont++;
		let {estado,tipo} = is_Empty(valores[cont]);
		console.log(`El elemento ${ID} es ${estado} y su Tipo es ${tipo} || false, si está vacío`);
		if (estado === true) {
			console.log("Verdadero, pase pa lante Rey");
			let {values,error,tipo} = verificar(valores[cont],ID);
			if (values) {
				new_values[ID] = values;
				privilegio[ID] = "Positivo";
				console.log(values);
			} else {
				errors[ID] = error;
				privilegio[ID] = tipo;
			}
		} else {
			console.log("Falso, Directo A Dirección");
			let {values, error} = verificar_privi(ID);
			if (values) {
				new_values[ID] = values;
				errors[ID] = error;
				privilegio[ID] = error;
			} else {
				console.log("Algo Muy malo pasa");
				errors[ID] = error;
				privilegio[ID] = error;
			}
		}
	});
	console.log(new_values);
	console.log(errors);
	console.log(privilegio);
	messages(errors,privilegio);
}

function verificar (datos,ID) {
	console.log(`Veficando ${datos} de ${ID} y Tipo ${typeof datos}`);
	switch (typeof datos) {
		case "string":
			var {values, error, tipo} = verificar_tipo(datos,ID);
			return {values, error, tipo};
		case "number":
			if (Number(datos)) {
				var {values, error, tipo} = verificar_tipo(datos,ID);
				return {values, error, tipo};
			} else {
				var {values, error} = verificar_privi(ID);
				return {"values": values, "error": "No hay datos introducidos o Son Invalidos ---__---", "tipo": error};
			}
		case "object":
			var values = procesar_objeto(datos,ID);
			return {values, error, tipo};
		default:
			console.log("Unfinded");
			break;
	}
}

function verificar_tipo (datos,ID) {
	console.log(`Veficando Tipos ${datos} de ${ID}`);
	const tipo = document.getElementById(ID).dataset.type;
	const nombre_per = document.getElementById(ID).dataset.nombre_per;
	if (typeof datos === "number") {
		let clean_data = limpiar_datos(datos.toString());
		let datos_validos = clean_data.match(regex[tipo]).join("");
		console.log(`Datos Válidos: ${datos_validos} Datos Limpios: ${clean_data} ${typeof clean_data} ${tipo}`);
		let decision = comparador(clean_data,datos_validos);
		if (decision===false) {
			console.log("Algo Falta");
			let {error} = verificar_privi(ID);
			return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": error};
		} else {
			if (datos_validos.includes(".")) {				
				console.log("Exitos");
				return {"values": parseFloat(clean_data), "error": undefined, "tipo":"Positivo"};
			} else {
				console.log("Exitos");
				return {"values": parseInt(clean_data), "error": undefined, "tipo":"Positivo"};
			}
		}
	} else {
		let clean_data = limpiar_datos(datos);
		//let datos_validos = clean_data.match(regex[tipo]).join(" ");
		if (clean_data.match(regex[tipo]) === null) {
			console.log("Error: Es NULL :(");
			let {error} = verificar_privi(ID);
			return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": error};
		} else {
			console.log("Passing");
			console.log(clean_data.match(regex[tipo]));
			let datos_validos = clean_data.match(regex[tipo]).join(" ");
			console.log(`Datos Válidos: ${datos_validos} Datos Limpios: ${clean_data} ${typeof clean_data} ${tipo}`);
			let decision = comparador(clean_data,datos_validos);
			if (decision===false) {
				console.log("Algo Falta");
				let {error} = verificar_privi(ID);
				return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": error};
			} else {
				console.log("Exitos");
				return {"values":clean_data, "error": undefined, "tipo":"Positivo"};
			}
		}
	}
	//let datos_juntos = datos_validos.join(" ");
	/*console.log(`Datos Válidos: ${datos_validos} Datos Limpios: ${clean_data} ${typeof clean_data} ${tipo}`);
	let decision = comparador(clean_data,datos_validos);
	if (decision===false) {
		console.log("Algo Falta");
		let {error} = verificar_privi(ID);
		return {"values":undefined, "error":`Falta algún dato o estás usando Caracteres no permitidos en ${nombre_per}`, "tipo": error};
	} else {
		console.log("Exitos");
		return {"values":clean_data, "error": undefined, "tipo":"Positivo"};
	}*/
}

function procesar_objeto (datos,ID) {
	console.log(`Procesando Objt ${datos} de ${ID}`);
	let new_data = Object.values(datos);
	let data_array = [];
	new_data.forEach((valores)=>{
		if (valores!="") {
			let {values, error} = verificar(valores,ID);
			data_array.push(values);
		} else {
			data_array.push(undefined);
		}
	});
	let valores_cad = data_array.join(",");
	return valores_cad;
}

function limpiar_datos (datos) {
	console.log(`Limpiando ${datos}`);
	if (typeof datos === "number") {
		const clean_data = datos;
		console.log(`Limpio Numero: ${clean_data} y Tipo ${typeof clean_data}`);
		return clean_data;
	} else {
		const clean_data = datos.replace(/\s+/g, ' ').trim();
		console.log(`Limpio: ${clean_data}`);
		return clean_data;
	}
}


function comparador (datos,datos_limpios) {
	console.log(`Comparando ${datos} y ${datos_limpios}`);
	let longitud_neta = length_data(datos);
	let longitud_limpia = length_data(datos_limpios);
	if (longitud_neta!=longitud_limpia) {
		return false;
	} else {
		return true;
	}
}

function length_data (datos) {
	console.log(`Midiendo ${datos}`);
	let {estado,tipo} = is_Empty(datos);
	if (estado === true) {
		const length_datos = datos.split("").length;
		console.log(`Datos Medidos ${length_datos}`);
		return length_datos;
	} else {
		const length_datos = 0;
		console.log(`Datos Medidos ${length_datos}`);
		return length_datos;
	}
}

function verificar_privi (ID) {
	console.log(`Veficando de ${ID}`);
	let elemento = document.getElementById(ID).dataset.priv;
	let apodo = document.getElementById(ID).dataset.nombre_per;
	switch (elemento) {
		case "required":
			return {"values": undefined, "error": `El Elemento ${apodo} es Requerido`};
		case "optional":
			return {"values": "Opcional","error": `El Elemento ${apodo} es Opcional`};
		default:
			console.log("Nada captado");
			break;
	}
}

function messages (errors,tipo) {
	console.log(`Mensajes  ${errors} de ${tipo}`);
	console.log(errors);
	console.log(tipo);
	let cont = -1;
	let Fallo = /(Requerido)|(Opcional)|(Positivo)/g;
	let IDS = Object.keys(tipo);
	let message = Object.values(errors);
	let tipos = Object.values(tipo);
	$(`#messages`).html("");
	IDS.forEach((id)=>{
		cont++;
		if (message[cont] === undefined) {
			
		} else {
			$(`#messages`).append(`<p class='error' onclick='close_this(this)'>${message[cont]}</p>`);
		}
		let similars = tipos[cont].match(Fallo).join("");
		switch (similars) {
			case "Requerido":
				$(`#${id}`).css("border-color",'#FF1E33');
				break;
			case "Opcional":
				$(`#${id}`).css("border-color",'#4D4D4D');
				break;
			case "Positivo":
				$(`#${id}`).css("border-color",'#31FF27');
				break;
			default:
				console.log("Nothing is Working");
				break;
		}
	});
}

function is_Empty (datos) {
	switch (typeof datos) {
		case "string":
			if (datos.trim() === "") {
				return {"estado":false, "tipo": "string"};
			} else {
				return {"estado":true, "tipo": "string"};
			}
		case "number":
			if (!datos) {
				return {"estado":false, "tipo": "number"};
			} else {
				return {"estado":true, "tipo": "number"};
			}
		case "array":
			if (datos.length === 0) {
				return {"estado":false, "tipo": "array"};
			} else {
				return {"estado":true, "tipo": "array"};
			}
		case "object":
			if (Object.keys(datos).length === 0) {
				return {"estado":false, "tipo": "object"};
			} else {
				return {"estado":true, "tipo": "object"};
			}
		default:
			console.log("Ningun Tipo Esperado");
			break;
	}
}
function close_this (button) {
	$(button).remove();
}
