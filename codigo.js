// Se utilizara una API para traducir los textos LibreTranslate
//EL tradcucotr con esta API
async function traducirTexto(texto, idiomaDestino) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=es|${idiomaDestino}`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos.responseData.translatedText;
}

// Textos de la página a traducir
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

// Función para traducir **toda la página** asegurando que todos los textos estén listos antes de cambiarlos
async function traducirPagina(idiomaDestino) {
    const promesas = Object.entries(elementosTraducibles).map(async ([id, texto]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            const textoTraducido = await traducirTexto(texto, idiomaDestino);
            return { id, textoTraducido };
        }
        return null;
    });

    const resultados = await Promise.all(promesas);

    resultados.forEach(resultado => {
        if (resultado) {
            document.getElementById(resultado.id).innerText = resultado.textoTraducido;
        }
    });
}

function cambiarIdioma(idioma) {
    const traducciones = {
        "es": { titulo: "Descubre Colombia", moneda: "COP", bandera: "images/bandera-es.png", idioma: "Español (COP)" },
        "en": { titulo: "Discover Colombia", moneda: "USD", bandera: "images/bandera-en.png", idioma: "Inglés (USD)" },
        "fr": { titulo: "Découvrez la Colombie", moneda: "EUR", bandera: "images/bandera-fr.png", idioma: "Francés (EUR)" },
        "de": { titulo: "Entdecke Kolumbien", moneda: "EUR", bandera: "images/bandera-de.png", idioma: "Alemán (EUR)" }
    };

    document.getElementById("titulo").innerText = traducciones[idioma].titulo;
    document.getElementById("bandera-actual").src = traducciones[idioma].bandera;
    document.getElementById("idioma-actual").innerText = traducciones[idioma].idioma;

    // Traducir el resto de la página
    if (idioma !== "es") {
        traducirPagina(idioma);
    } else {
        // Restaurar los textos originales en español
        for (const id in elementosTraducibles) {
            document.getElementById(id).innerText = elementosTraducibles[id];
        }
    }
}