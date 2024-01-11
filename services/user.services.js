// Importa los módulos necesarios
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//Registrar Usuarios
const registerUserService = async ({ userName, email, password, admin, suspended }) => {
	const emailExist = await User.findOne({ email }) //Verificamos si el email que va a ser registrado ya existe, en caso de no existir devolvemos un error
	if (emailExist) throw new Error("El correo electrónico ingresado ya está en uso, por favor ingrese otro.");

	const saltRounds = 10; 	//Configuramos la cantidad de saltRounds de nuestro password, esto indica el nivel de seguridad, por convencion es 10, ya que si es mayor va a tardar mucho tiempo en descifrarse

	const hashedPassword = await bcrypt.hash(password, saltRounds);

	const newUser = await User.create({ userName, email, password: hashedPassword, admin, suspended });
	if (!newUser) throw new Error('Hubo un error al crear el nuevo usuario');
	return newUser;
};

//Loguear Usuarios
const loginUserService = async ({ email, password}) => {
  let userFounded;
  const secretKey = process.env.SECRET_KEY;

  if (email) {
    userFounded = await User.findOne({ email }) //Buscamos el usuario con el email ingresado en la base de datos, en caso de encontrarlo lo guardamos en userFounded
  }
  if (!userFounded) throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.'); //En caso de que el email no sea encontrado devolvemos un error
  const passwordMatch = await bcrypt.compare(password, userFounded.password); //Comparamos el password ingresado con el password de la base de datos
  if (!passwordMatch) throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');//En caso de que no coincidan devolvemos un error

	//En caso de pasar las comprobaciones anteriores y que todo sea correcto, creamos el token para darle acceso al usuario logueado
  const payload = { //El payload seria el cuerpo de nuestro token
    userFounded,
  }
  const token = await jwt.sign(payload, secretKey, { //Con el metodo sign creamos el token y le asignamos un tiempo para que expire, por lo general 10hs
    expiresIn: '10h'
  });

  return { token, userFounded }
};

//Servicio para obtener todos los usuarios
const getAllusersService = async () => {
  const users = await User.find() //Usamos el metodo find para buscar en el modelo de usuarios 
  if (!users) throw new Error('No se encontraron usuarios con los filtros seleccionados');//En caso de no encontrar nada devolvemos un error
  return users;
}


module.exports = {
	registerUserService,
	loginUserService,
	getAllusersService
}