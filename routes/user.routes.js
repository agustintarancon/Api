// Importa los módulos necesarios
const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/user.controller');
const { jwtValidator } = require("../middlewares/jwtValidator");

const route = express();

// Ruta para obtener todos los usuarios (requiere validación de JWT)
route.get('/', jwtValidator, getAllUsers);
// Ruta para crear un nuevo usuario
route.post('/', registerUser);
// Ruta para iniciar sesión (login) de un usuario
route.post('/login', loginUser);

//Exportando rutas
module.exports = route;
