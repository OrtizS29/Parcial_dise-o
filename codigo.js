// Se utilizara una API para traducir los textos LibreTranslate
//EL tradcucotr con esta API
async function traducirTexto(texto, idiomaDestino) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=es|${idiomaDestino}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.responseData.translatedText;
    } catch (error) {
        console.error("Error en la traducción:", error);
        return texto; // En caso de error, devuelve el texto original
    }
}

// Elementos a traducir en la página
const elementosTraducibles = {
    "titulo": "Descubre Colombia",
    "cartagena-titulo": "Cartagena",
    "cartagena-texto": "Cartagena es una hermosa ciudad con playas y una rica historia colonial.",
    "bogota-titulo": "Bogotá",
    "bogota-texto": "Bogotá, la capital de Colombia, es conocida por su diversidad cultural.",
    "medellin-titulo": "Medellín",
    "medellin-texto": "Descripción de Medellín...",
    "cali-titulo": "Cali",
    "cali-texto": "Descripción de Cali...",
    "footer-texto": "© 2025 Todos los derechos reservados | Turismo Colombia"
};

// Función para traducir toda la página
async function traducirPagina(idiomaDestino) {
    for (const id in elementosTraducibles) {
        const elemento = document.getElementById(id);
        if (elemento) {
            const textoTraducido = await traducirTexto(elementosTraducibles[id], idiomaDestino);
            elemento.innerText = textoTraducido;
        }
    }
}

// Evento para cambiar el idioma al seleccionar una opción
document.getElementById("select-idioma").addEventListener("change", function () {
    const idiomaSeleccionado = this.value;
    if (idiomaSeleccionado !== "es") {
        traducirPagina(idiomaSeleccionado);
    } else {
        // Restaurar el texto original en español
        for (const id in elementosTraducibles) {
            document.getElementById(id).innerText = elementosTraducibles[id];
        }
    }
});