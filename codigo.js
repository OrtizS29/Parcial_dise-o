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
    "hotelCa": "Hoteles","hotelB":"Hoteles","hotelM":"Hoteles","hotelC":"Hoteles",
    "gastroCa": "Gastronomía","gastroB":"Gastronomía","gastroM":"Gastronomía","gastroC":"Gastronomía",
    "culCa": "Cultura","culB":"Cultura","culM":"Cultura","culC":"Cultura",
    "atraCa": "Atracciones","atraB":"Atracciones","atraM":"Atracciones","atraC":"Atracciones",
    "footer-texto": "© 2025 Todos los derechos reservados | Turismo Colombia"
};

// Traducir los botones de todas las secciones
document.querySelectorAll('.translate').forEach(function(button) {
    // Obtener el valor de data-filter para identificar el botón
    const dataFilter = button.getAttribute('data-filter');
    
    // Si existe una traducción para este data-filter, se aplica
    if (elementosTraducibles[dataFilter]) {
        button.textContent = elementosTraducibles[dataFilter];
    }
});

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

document.addEventListener("DOMContentLoaded", function () {
    // 📌 Lista de ciudades
    const ciudades = ["cartagena", "bogota", "medellin", "cali"];

    // 📌 Imágenes organizadas por ciudad y categoría
    const imagenes = {
        cartagena: {
            hoteles: ["cartagena-hotel1.jpg", "cartagena-hotel2.jpg"],
            gastronomia: ["cartagena-comida1.jpg", "cartagena-comida2.jpg"],
            cultura: ["cartagena-cultura1.jpg", "cartagena-cultura2.jpg"],
            atracciones: ["cartagena-atraccion1.jpg", "cartagena-atraccion2.jpg"]
        },
        bogota: {
            hoteles: ["bogota-hotel1.jpg", "bogota-hotel2.jpg"],
            gastronomia: ["bogota-comida1.jpg", "bogota-comida2.jpg"],
            cultura: ["bogota-cultura1.jpg", "bogota-cultura2.jpg"],
            atracciones: ["bogota-atraccion1.jpg", "bogota-atraccion2.jpg"]
        },
        medellin: {
            hoteles: ["medellin-hotel1.jpg", "medellin-hotel2.jpg"],
            gastronomia: ["medellin-comida1.jpg", "medellin-comida2.jpg"],
            cultura: ["medellin-cultura1.jpg", "medellin-cultura2.jpg"],
            atracciones: ["medellin-atraccion1.jpg", "medellin-atraccion2.jpg"]
        },
        cali: {
            hoteles: ["cali-hotel1.jpg", "cali-hotel2.jpg"],
            gastronomia: ["cali-comida1.jpg", "cali-comida2.jpg"],
            cultura: ["cali-cultura1.jpg", "cali-cultura2.jpg"],
            atracciones: ["cali-atraccion1.jpg", "cali-atraccion2.jpg"]
        }
    };

    // 📌 Función para cargar la galería de una ciudad
    function cargarGaleria(ciudad) {
        const galeria = document.getElementById(`gallery-${ciudad}`);
        if (!galeria) return;

        galeria.innerHTML = ""; // Limpiar antes de agregar nuevas imágenes

        Object.entries(imagenes[ciudad]).forEach(([categoria, listaImagenes]) => {
            listaImagenes.forEach(img => {
                const div = document.createElement("div");
                div.classList.add("gallery-item", `${ciudad}-${categoria}`);
                div.innerHTML = `<img src="images/${img}" alt="${categoria}">`;
                galeria.appendChild(div);
            });
        });
    }

    // 📌 Cargar las galerías de todas las ciudades al inicio
    ciudades.forEach(ciudad => cargarGaleria(ciudad));

    // 📌 Manejo de filtros
    document.querySelectorAll(".filter-btn").forEach(boton => {
        boton.addEventListener("click", function () {
            const [ciudad, categoria] = this.dataset.filter.split("-");

            document.querySelectorAll(`#gallery-${ciudad} .gallery-item`).forEach(item => {
                item.style.display = "none";
            });

            document.querySelectorAll(`.${ciudad}-${categoria}`).forEach(item => {
                item.style.display = "block";
            });

            // Actualizar botones activos
            document.querySelectorAll(`#gallery-${ciudad} .filter-btn`).forEach(btn => {
                btn.classList.remove("active");
            });
            this.classList.add("active");
        });
    });
});

