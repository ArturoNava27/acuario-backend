const API_BASE = "/"; // tu backend ya sirve este frontend

// Cargar temperaturas y mostrar gráfica
async function cargarTemperaturas() {
    const res = await fetch(API_BASE + "temperaturas");
    const datos = await res.json();

    const labels = datos.map(d => new Date(d.fecha).toLocaleString());
    const temps = datos.map(d => parseFloat(d.temperatura));

    const ctx = document.getElementById("temperaturaChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Temperatura (°C)",
                data: temps,
                borderColor: "blue",
                backgroundColor: "rgba(0,123,255,0.2)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Fecha" } },
                y: { title: { display: true, text: "Temperatura °C" }, min: 0 }
            }
        }
    });
}

// Cargar última comida y calcular próxima (+5 min)
async function cargarComida() {
    const res = await fetch(API_BASE + "comidas");
    const data = await res.json();

    if (data) {
        const ultima = new Date(data.fecha);
        document.getElementById("ultimaComida").textContent = ultima.toLocaleString();

        const proxima = new Date(ultima.getTime() + 5 * 60 * 1000);
        document.getElementById("proximaComida").textContent = proxima.toLocaleString();
    } else {
        document.getElementById("ultimaComida").textContent = "Sin registros";
        document.getElementById("proximaComida").textContent = "-";
    }
}

// Botón para alimentar al pez
document.getElementById("alimentarPez").addEventListener("click", async () => {
    try {
        const res = await fetch(API_BASE + "comidas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: "Placeholder comida",
                fecha: new Date().toISOString()
            })
        });

        const data = await res.json();
        if (data.ok) {
            alert("¡Pez alimentado! 🐟");
            cargarComida(); // Actualiza la última y próxima comida
        } else {
            alert("Error alimentando al pez");
        }
    } catch (err) {
        alert("Error conectando con la API");
    }
});

// Inicializar
cargarTemperaturas();
cargarComida();
