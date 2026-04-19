const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = path.join(__dirname, "gastos.json");

app.use(cors());
app.use(express.json());

// Helper: Leer archivo de forma segura
const leerGastos = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper: Guardar archivo
const guardarGastos = (gastos) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(gastos, null, 2));
};

// Rutas API
app.get("/api/gastos", (req, res) => {
    res.json(leerGastos());
});

app.post("/api/gastos", (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    
    // Validación básica de servidor
    if (!nombre || !precio || !cantidad) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const gastos = leerGastos();
    const nuevoGasto = {
        id: Date.now().toString(),
        nombre,
        precio: Number(precio),
        cantidad: Number(cantidad),
        fecha: new Date().toISOString()
    };

    gastos.push(nuevoGasto);
    guardarGastos(gastos);
    res.status(201).json(nuevoGasto);
});

app.delete("/api/gastos/:id", (req, res) => {
    const { id } = req.params;
    const gastos = leerGastos();
    const filtrados = gastos.filter(g => g.id !== id);
    
    if (gastos.length === filtrados.length) {
        return res.status(404).json({ error: "Gasto no encontrado" });
    }

    guardarGastos(filtrados);
    res.json({ mensaje: "Eliminado correctamente" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));