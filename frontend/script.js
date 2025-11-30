const API_URL = "https://acuario-backend.onrender.com";

// Gráfica
let temperaturaChart;

async function obtenerTemperaturas() {
    const res = await fetch(`${API_URL}/temperaturas`);
    const data = await res.json();

    const labels = data.map(d => new Date(d.fecha));
    const temps = data.map(d => parseFloat(d.temperatura));

    const ctx = document.getElementById("temperaturaChart").getContext("2d");

    if (temperaturaChart) {
        temperaturaChart.destroy();
    }

    temperaturaChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Temperatura (°C)",
                data: temps,
                borderColor: "blue",
                backgroundColor: "rgba(0,123,255,0.2)",
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "minute",
                        tooltipFormat: "yyyy-MM-dd HH:mm:ss"
                    },
                    title: { display: true, text: "Fecha" }
                },
                y: {
                    title: { display: true, text: "Temperatura °C" },
                    min: 0
                }
            }
        }
    });
}

// Última comida
async function obtenerUltimaComida() {
    const res = await fetch(`${API_URL}/comidas`);
    const data = await res.json();

    if (!data) return;

    const ultima = new Date(data.fecha);
    const proxima = new Date(ultima.getTime() + 5 * 60000); // +5 min

    document.getElementById("ultimaComida").textContent = ultima.toLocaleString();
    document.getElementById("proximaComida").textContent = proxima.toLocaleString();
}

// Botón alimentar pez
document.getElementById("alimentarPez").addEventListener("click", async () => {
    const fecha = new Date().toISOString();

    // POST a la API de comidas (placeholder)
    await fetch(`${API_URL}/comidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Pez alimentado", fecha })
    });

    // Actualizar la gráfica y comida
    await obtenerTemperaturas();
    await obtenerUltimaComida();
});

// Inicialización
window.onload = async () => {
    await obtenerTemperaturas();
    await obtenerUltimaComida();
};
