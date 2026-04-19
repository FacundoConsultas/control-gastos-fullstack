const API_URL = "http://localhost:3000/api/gastos";

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", fetchGastos);

async function fetchGastos() {
    try {
        const res = await fetch(API_URL);
        const gastos = await res.json();
        renderizarGastos(gastos);
    } catch (error) {
        console.error("Error al cargar gastos:", error);
    }
}

function renderizarGastos(gastos) {
    const lista = document.getElementById("lista-gastos");
    const totalDisplay = document.getElementById("total-monto");
    lista.innerHTML = "";
    let totalAcumulado = 0;

    gastos.forEach(g => {
        const subtotal = g.precio * g.cantidad;
        totalAcumulado += subtotal;

        const li = document.createElement("li");
        li.className = "gasto-item";
        li.innerHTML = `
            <div class="info">
                <strong>${g.nombre}</strong>
                <span>$${g.precio} x ${g.cantidad} = $${subtotal}</span>
            </div>
            <button class="btn-delete" onclick="eliminarGasto('${g.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });

    totalDisplay.innerText = `$${totalAcumulado.toLocaleString()}`;
}

async function agregarGasto() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;

    if (!nombre || !precio || !cantidad) return alert("Completa todos los campos");

    const nuevoGasto = { nombre, precio, cantidad };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoGasto)
        });

        if (res.ok) {
            limpiarFormulario();
            fetchGastos();
        }
    } catch (error) {
        alert("Error al conectar con el servidor");
    }
}

async function eliminarGasto(id) {
    if (!confirm("¿Seguro que quieres eliminarlo?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchGastos();
    } catch (error) {
        alert("No se pudo eliminar");
    }
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
}