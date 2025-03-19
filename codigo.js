// Se utilizara una API para traducir los textos LibreTranslate
//EL tradcucotr con esta API
async function traducirTexto(texto, idiomaDestino) {
    //Se ejecuto desde Docker
    const url = "http://localhost:5000/translate";
    //espera un JSON porque la API espera una estructura diferente
    const respuesta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: texto,
            source: "es",   // El idioma original de la página
            target: idiomaDestino,  // El idioma al que queremos traducir
            format: "text",
            api_key: ""   // LibreTranslate no requiere API key si está en local
        })
    });

    const datos = await respuesta.json();
    return datos.translatedText;
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