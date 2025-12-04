document.getElementById("Login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioInput = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuarioInput || !password) {
        alert("Completa todos los campos");
        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario: usuarioInput, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.mensaje);
            return;
        }

        // Guardar usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Redirigir al index
        window.location.href = "/index.html";

    } catch (error) {
        alert("Error en el servidor");
    }
});
