require("dotenv").config(); // 👈 Primera línea

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE POSTGRES
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// RUTA PRINCIPAL (PARA PRUEBAS EN NAVEGADOR)
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// GET todas las temperaturas
app.get("/temperaturas", async (req, res) => {
  try {
    const q = await pool.query("SELECT * FROM temperatura_registrada ORDER BY fecha ASC");
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo temperaturas" });
  }
});

// POST nueva temperatura
app.post("/temperaturas", async (req, res) => {
  try {
    const { temperatura, fecha } = req.body;
    await pool.query(
      "INSERT INTO temperatura_registrada (temperatura, fecha) VALUES ($1, $2)",
      [temperatura, fecha]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error insertando temperatura" });
  }
});

// GET última comida
app.get("/comidas", async (req, res) => {
  try {
    const q = await pool.query("SELECT * FROM comida ORDER BY fecha DESC LIMIT 1");
    res.json(q.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo última comida" });
  }
});

// POST nueva comida
app.post("/comidas", async (req, res) => {
  try {
    const { nombre, fecha } = req.body;
    await pool.query(
      "INSERT INTO comida (nombre, fecha) VALUES ($1, $2)",
      [nombre, fecha]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error insertando comida" });
  }
});

// SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
