const API_BASE = "https://acuario-backend.onrender.com/";


// Cargar temperaturas y mostrar gráfica
let temperaturaChart;
async function cargarTemperaturas() {
    const res = await fetch(API_BASE + "temperaturas");
    const datos = await res.json();

    const labels = datos.map(d => new Date(d.fecha).toLocaleString());
    const temps = datos.map(d => parseFloat(d.temperatura));

    // Colores dinámicos según temperatura
    const colorPoints = temps.map(t => {
        if (t < 23 || t > 29) return "red";           // peligro
        if (t >= 27 && t <= 29) return "orange";      // tibio
        return "green";                               // normal
    });

    const ctx = document.getElementById("temperaturaChart").getContext("2d");

    if (temperaturaChart) {
        temperaturaChart.data.labels = labels;
        temperaturaChart.data.datasets[0].data = temps;
        temperaturaChart.data.datasets[0].pointBackgroundColor = colorPoints;
        temperaturaChart.update();
    } else {
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
                    pointRadius: 6, // puntos más grandes
                    pointBackgroundColor: colorPoints
                }]
            },
            options: {
                responsive: true,

                // --- 🔥 ZOOM Y PAN ACTIVO ---
                plugins: {
                    zoom: {
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "xy"
                        },
                        pan: {
                            enabled: true,
                            mode: "xy"
                        }
                    }
                },

                scales: {
                    x: {
                        title: { display: true, text: "Fecha" }
                    },
                    y: {
                        title: { display: true, text: "Temperatura °C" },
                        beginAtZero: false,
                        suggestedMin: Math.min(...temps) - 1,
                        suggestedMax: Math.max(...temps) + 1
                    }
                }
            }
        });
    }
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

// Simular temperatura nueva
function generarTemperatura() {
    return (23 + Math.random() * 4).toFixed(2); // entre 23 y 27
}

// Botón para alimentar al pez
document.getElementById("alimentarPez").addEventListener("click", async () => {
    try {
        const ahora = new Date().toISOString();
        const nuevaTemp = generarTemperatura();

        // Guardar nueva comida
        await fetch(API_BASE + "comidas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha: ahora })
        });

        // Guardar nueva temperatura simulada
        await fetch(API_BASE + "temperatura", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                temperatura: nuevaTemp,
                fecha: ahora
            })
        });

        alert(`¡Pez alimentado! Nueva temperatura registrada: ${nuevaTemp}°C`);

        cargarComida();
        cargarTemperaturas();
    } catch (err) {
        alert("Error conectando con la API");
        console.error(err);
    }
});

// Inicializar
cargarTemperaturas();
cargarComida();
