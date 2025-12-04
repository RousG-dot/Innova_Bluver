const express = require('express');
const app = express();
const PORT = 3000;

// Base de datos temporal
let usuarios = [];

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos SIN cargar index.html automáticamente
app.use(express.static('public', { index: false }));

// Ruta raíz → login.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// ---------------------- REGISTRO ----------------------
app.post('/api/registro', (req, res) => {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  const existe = usuarios.find(u => u.correo === correo);
  if (existe) {
    return res.status(400).json({ mensaje: "El usuario ya existe" });
  }

  usuarios.push({ nombre, correo, password });
  res.json({ mensaje: "Usuario registrado correctamente" });
});

// ---------------------- LOGIN FLEXIBLE ----------------------
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  const userFound = usuarios.find(
    u => (u.correo === usuario || u.nombre === usuario) && u.password === password
  );

  if (!userFound) {
    return res.status(400).json({ mensaje: "Credenciales incorrectas" });
  }

  res.json({
    mensaje: "Login exitoso",
    usuario: {
      nombre: userFound.nombre,
      correo: userFound.correo
    }
  });
});

// ---------------------- API LISTA DE USUARIOS ----------------------
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// ---------------------- INICIO SERVIDOR ----------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
