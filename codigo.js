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
    "com":"Comparte Tu Experiencia",
    "comment-button":"Publicar Comentario",
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
        "es": { titulo: "Descubre Colombia", bandera: "images/bandera-es.png", idioma: "Español " },
        "en": { titulo: "Discover Colombia", bandera: "images/bandera-en.png", idioma: "Inglés " },
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
            hoteles: [
                "cartagena-hotel1.jpg",
                "cartagena-hotel2.jpg",
                "cartagena-hotel3.jpg", // Nueva imagen
                "cartagena-hotel4.jpg"  // Nueva imagen
            ],
            gastronomia: ["cartagena-comida1.jpg", "cartagena-comida2.jpg"],
            cultura: ["cartagena-cultura1.jpg", "cartagena-cultura2.jpg"],
            atracciones: ["cartagena-atraccion1.jpg", "cartagena-atraccion2.jpg"]
        },
        bogota: {
            hoteles: [
                "bogota-hotel1.jpg",
                "bogota-hotel2.jpg",
                "bogota-hotel3.jpg", // Nueva imagen
                "bogota-hotel4.jpg"  // Nueva imagen
            ],
            gastronomia: ["bogota-comida1.jpg", "bogota-comida2.jpg"],
            cultura: ["bogota-cultura1.jpg", "bogota-cultura2.jpg"],
            atracciones: ["bogota-atraccion1.jpg", "bogota-atraccion2.jpg"]
        },
        medellin: {
            hoteles: [
                "medellin-hotel1.jpg",
                "medellin-hotel2.jpg",
                "medellin-hotel3.jpg", // Nueva imagen
                "medellin-hotel4.jpg"  // Nueva imagen
            ],
            gastronomia: ["medellin-comida1.jpg", "medellin-comida2.jpg"],
            cultura: ["medellin-cultura1.jpg", "medellin-cultura2.jpg"],
            atracciones: ["medellin-atraccion1.jpg", "medellin-atraccion2.jpg"]
        },
        cali: {
            hoteles: [
                "cali-hotel1.jpg",
                "cali-hotel2.jpg",
                "cali-hotel3.jpg", // Nueva imagen
                "cali-hotel4.jpg"  // Nueva imagen
            ],
            gastronomia: ["cali-comida1.jpg", "cali-comida2.jpg"],
            cultura: ["cali-cultura1.jpg", "cali-cultura2.jpg"],
            atracciones: ["cali-atraccion1.jpg", "cali-atraccion2.jpg"]
        }
    };

    const textosPersonalizados = {
        "cartagena-hotel1.jpg": "Hotel Boutique en Cartagena",
        "cartagena-hotel2.jpg": "Vista al mar en Cartagena",
        "bogota-hotel1.jpg": "Hotel en el centro de Bogotá",
        // Agrega más textos personalizados aquí
    };
    
    function cargarGaleria(ciudad) {
        const galeria = document.getElementById(`gallery-${ciudad}`);
        if (!galeria) return;
    
        galeria.innerHTML = ""; // Limpiar antes de agregar nuevas imágenes
    
        // Cargar solo las imágenes de la categoría "hoteles" al inicio
        const categoria = "hoteles"; // Categoría por defecto
        const listaImagenes = imagenes[ciudad][categoria];
    
        listaImagenes.forEach(img => {
            const div = document.createElement("div");
            div.classList.add("gallery-item", `${ciudad}-${categoria}`);
    
            // Crear el texto que se mostrará sobre la imagen
            const texto = document.createElement("div");
            texto.classList.add("gallery-text");
            texto.innerText = `Imagen de ${categoria} en ${ciudad}`; // Texto personalizado
    
            // Crear la imagen
            const imagen = document.createElement("img");
            imagen.src = `images/${img}`;
            imagen.alt = `${categoria}`;
    
            // Agregar la imagen y el texto al contenedor
            div.appendChild(imagen);
            div.appendChild(texto);
    
            // Agregar el contenedor a la galería
            galeria.appendChild(div);
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

// FORMULARIO
document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll(".rating span");
    const commentButton = document.querySelector("#comment-button");
    const nameInput = document.querySelector("#name");
    const commentInput = document.querySelector("#comment");
    const reviewList = document.querySelector(".review-list");

    let selectedRating = 0; // Guarda la calificación seleccionada

    if (!reviewList) {
        console.error("⚠️ Error: No se encontró '.review-list' en el HTML.");
        return;
    }

    // Agregar un comentario fijado predeterminado
    const defaultReview = document.createElement("div");
    defaultReview.classList.add("review");
    defaultReview.innerHTML = `
        <img src="images/cris.png" alt="UsuarioP">
        <div class="review-content">
            <h4>Cris</h4>
            <div class="review-stars">★★★★★</div>
            <p>¡Que gran Página Eh!, Saludos del Bicho, Siuu!</p>
        </div>
    `;
    reviewList.prepend(defaultReview); // Agregar comentario fijo al inicio

    // ⭐ Manejo de estrellas ⭐
    stars.forEach((star, index) => {
        star.addEventListener("mouseover", () => highlightStars(index));
        star.addEventListener("click", () => selectStars(index));
        star.addEventListener("mouseout", resetStars);
    });

    function highlightStars(index) {
        stars.forEach((star, i) => {
            star.style.color = i <= index ? "#f5c518" : "#ccc";
        });
    }

    function selectStars(index) {
        selectedRating = index + 1;
        highlightStars(index);
    }

    function resetStars() {
        stars.forEach((star, i) => {
            star.style.color = i < selectedRating ? "#f5c518" : "#ccc";
        });
    }

    // 📌 Publicar comentario
    commentButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        console.log("📌 Datos ingresados:", { name, comment, selectedRating });

        if (name === "" || comment === "" || selectedRating === 0) {
            alert("❌ Por favor, completa todos los campos y selecciona una calificación.");
            return;
        }

        // Crear comentario
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review");
        reviewItem.innerHTML = `
            <img src="images/usuario.png" alt="Usuario">
            <div class="review-content">
                <h4>${name}</h4>
                <div class="review-stars">${"★".repeat(selectedRating)}${"☆".repeat(5 - selectedRating)}</div>
                <p>${comment}</p>
            </div>
        `;

        reviewList.prepend(reviewItem); // Agregar comentario

        // Limpiar campos
        nameInput.value = "";
        commentInput.value = "";
        selectedRating = 0;
        resetStars();
    });
});

