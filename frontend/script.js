const API_URL = "https://acuario-backend.onrender.com"; // ✅ tu backend

const ctx = document.getElementById("graficaTemperatura").getContext("2d");
let graficaTemperatura;

// Obtener temperaturas
async function cargarTemperaturas() {
    const response = await fetch(`${API_URL}/temperaturas`);
    const datos = await response.json();

    const fechas = datos.map(d => new Date(d.fecha).toLocaleString());
    const temps = datos.map(d => d.temperatura);

    if (!graficaTemperatura) {
        graficaTemperatura = new Chart(ctx, {
            type: "line",
            data: {
                labels: fechas,
                datasets: [{
                    label: "Temperatura (°C)",
                    data: temps,
                    borderColor: "blue",
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        graficaTemperatura.data.labels = fechas;
        graficaTemperatura.data.datasets[0].data = temps;
        graficaTemperatura.update();
    }
}

// Cargar última comida
async function cargarComida() {
    const response = await fetch(`${API_URL}/comidas`);
    const ultimo = await response.json();

    const ultimaFecha = new Date(ultimo.fecha);
    document.getElementById("ultimaComida").textContent = ultimaFecha.toLocaleString();

    const siguiente = new Date(ultimaFecha.getTime() + 5 * 60000);
    document.getElementById("siguienteComida").textContent = siguiente.toLocaleString();
}

// Botón alimentar pez
document.getElementById("btnAlimentar").addEventListener("click", async () => {
    alert("Se envió la señal para alimentar al pez (placeholder)");
    
    // Registrar en base de datos
    await fetch(`${API_URL}/comidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Alimentación automática", fecha: new Date().toISOString() })
    });

    cargarComida(); // Actualizar tiempo
});

// Iniciar
cargarTemperaturas();
cargarComida();
